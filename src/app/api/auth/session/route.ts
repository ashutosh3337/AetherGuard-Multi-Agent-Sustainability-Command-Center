import { NextResponse, type NextRequest } from "next/server";
import { RECENT_SIGN_IN_SECONDS, SESSION_COOKIE } from "@/lib/auth/constants";
import { parseRole } from "@/lib/auth/roles";
import { serverEnv } from "@/lib/server/env";
import { getAdminAppCheck, getAdminAuth } from "@/lib/server/firebase-admin";
import { log } from "@/lib/server/log";
import { rateLimit } from "@/lib/server/rate-limit";
import { bearerToken, clientIp, isSameOrigin } from "@/lib/server/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

function deny(status: number, error: string, extra: Record<string, string> = {}) {
  return NextResponse.json({ error }, { status, headers: { ...noStore, ...extra } });
}

/**
 * POST /api/auth/session — exchange a fresh Firebase ID token for an httpOnly
 * session cookie.
 *
 * Defence in depth:
 *  1. Rate limited per IP (brute-force / token-stuffing).
 *  2. Origin check (CSRF).
 *  3. Optional App Check verification (only genuine app instances).
 *  4. ID token verified with revocation check + must be a *recent* sign-in.
 *  5. Cookie is httpOnly (no JS access → XSS can't steal it), Secure,
 *     SameSite=Lax, scoped to `/`.
 */
export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const rl = rateLimit(`session:${ip}`, { limit: 10, windowMs: 60_000 });
  if (!rl.ok) return deny(429, "rate_limited", { "Retry-After": String(rl.retryAfterSec) });

  if (!isSameOrigin(req)) return deny(403, "forbidden_origin");

  const idToken = bearerToken(req.headers.get("authorization"));
  if (!idToken) return deny(401, "missing_token");

  const env = serverEnv();
  if (env.APP_CHECK_ENFORCE) {
    const appCheckToken = req.headers.get("x-firebase-appcheck");
    if (!appCheckToken) return deny(401, "app_check_required");
    try {
      await getAdminAppCheck().verifyToken(appCheckToken);
    } catch {
      log.warn("auth.session.app_check_failed", { ip });
      return deny(401, "app_check_invalid");
    }
  }

  try {
    const auth = getAdminAuth();
    const decoded = await auth.verifyIdToken(idToken, true);

    if (Date.now() / 1000 - decoded.auth_time > RECENT_SIGN_IN_SECONDS) {
      return deny(401, "recent_sign_in_required");
    }

    const expiresInMs = env.SESSION_COOKIE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn: expiresInMs });
    const role = parseRole(decoded.role);

    const res = NextResponse.json({ ok: true, role }, { headers: noStore });
    res.cookies.set(SESSION_COOKIE, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: Math.floor(expiresInMs / 1000),
    });

    log.info("auth.session.created", { uid: decoded.uid, role, provider: decoded.firebase.sign_in_provider });
    return res;
  } catch (err) {
    log.warn("auth.session.rejected", { ip, reason: (err as { code?: string }).code ?? "unknown" });
    return deny(401, "invalid_token");
  }
}

/**
 * DELETE /api/auth/session — sign out. Clears the cookie and revokes the
 * user's refresh tokens so any other stolen/forgotten session dies too.
 */
export async function DELETE(req: NextRequest) {
  if (!isSameOrigin(req)) return deny(403, "forbidden_origin");

  const cookie = req.cookies.get(SESSION_COOKIE)?.value;
  const res = NextResponse.json({ ok: true }, { headers: noStore });
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  if (cookie) {
    try {
      const auth = getAdminAuth();
      const decoded = await auth.verifySessionCookie(cookie);
      await auth.revokeRefreshTokens(decoded.sub);
      log.info("auth.session.revoked", { uid: decoded.sub });
    } catch {
      // Already invalid — nothing to revoke.
    }
  }
  return res;
}
