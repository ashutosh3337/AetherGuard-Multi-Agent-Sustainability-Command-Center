/**
 * Edge-safe auth constants (imported by middleware, server and client).
 *
 * `__session` is deliberately chosen: it is the ONLY cookie Firebase Hosting /
 * App Hosting CDN forwards to the backend, so sessions survive the edge cache.
 */
export const SESSION_COOKIE = "__session";

/** Routes that require an authenticated session (checked in middleware + layout). */
export const PROTECTED_PREFIXES = ["/dashboard", "/agents", "/insights", "/impact", "/settings"] as const;

/** A fresh sign-in is required to mint a session cookie (mitigates token replay). */
export const RECENT_SIGN_IN_SECONDS = 5 * 60;
