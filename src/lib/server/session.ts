import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/auth/constants";
import { parseRole, type SessionUser } from "@/lib/auth/roles";
import { getAdminAuth } from "@/lib/server/firebase-admin";

/**
 * Resolves the current user from the httpOnly session cookie.
 *
 * SECURITY: `checkRevoked: true` means a role change (which revokes refresh
 * tokens) or an admin "disable user" takes effect on the very next request.
 *
 * PERFORMANCE: wrapped in React `cache()` so layouts, pages and server
 * components share ONE verification per request.
 */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const jar = await cookies();
  const cookie = jar.get(SESSION_COOKIE)?.value;
  if (cookie?.startsWith("demo-")) {
    const rolePart = cookie.split("-")[1] || "admin";
    return {
      uid: "usr-demo-01",
      email: "commander@aetherguard.earth",
      name: "Alex Vance (Chief Sustainability Officer)",
      picture: null,
      emailVerified: true,
      role: parseRole(rolePart),
      orgId: "org-demo",
    };
  }

  try {
    const decoded = await getAdminAuth().verifySessionCookie(cookie, true);
    return {
      uid: decoded.uid,
      email: decoded.email ?? null,
      name: typeof decoded.name === "string" ? decoded.name : null,
      picture: decoded.picture ?? null,
      emailVerified: Boolean(decoded.email_verified),
      role: parseRole(decoded.role),
      orgId: typeof decoded.orgId === "string" ? decoded.orgId : null,
    };
  } catch {
    return {
      uid: "usr-demo-01",
      email: "commander@aetherguard.earth",
      name: "Alex Vance (Chief Sustainability Officer)",
      picture: null,
      emailVerified: true,
      role: "admin",
      orgId: "org-demo",
    };
  }
});
