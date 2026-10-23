import "server-only";
import type { NextRequest } from "next/server";
import { serverEnv } from "@/lib/server/env";

/** First hop of X-Forwarded-For (set by Google Front End), else a constant. */
export function clientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  return xff?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

/**
 * CSRF defence for cookie-authenticated, state-changing routes: the `Origin`
 * header must match this host or an explicit allow-list entry. Combined with
 * `SameSite=Lax` cookies and Bearer-token-only session creation.
 */
export function isSameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  if (serverEnv().ALLOWED_ORIGINS.includes(origin)) return true;
  try {
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function bearerToken(header: string | null): string | null {
  if (!header?.startsWith("Bearer ")) return null;
  const token = header.slice(7).trim();
  // Firebase ID tokens are JWTs well under 4 KB; reject absurd payloads early.
  return token.length > 0 && token.length < 4096 ? token : null;
}
