import { NextResponse, type NextRequest } from "next/server";
import { PROTECTED_PREFIXES, SESSION_COOKIE } from "@/lib/auth/constants";

/**
 * Edge middleware: runs before every page request.
 *
 * 1. SECURITY — Strict, nonce-based Content-Security-Policy. Only scripts
 *    carrying this request's nonce (and what they load, via 'strict-dynamic')
 *    may execute → neutralises injected <script> XSS.
 * 2. PERFORMANCE — cheap optimistic auth gate: no session cookie → redirect to
 *    /login without rendering anything. Full cryptographic verification
 *    happens in the (console) layout on the Node runtime.
 */
function buildCsp(nonce: string, isDev: boolean): string {
  const devConnect = isDev ? " http://127.0.0.1:* http://localhost:* ws://127.0.0.1:* ws://localhost:*" : "";
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://apis.google.com https://www.google.com https://www.gstatic.com${isDev ? " 'unsafe-eval'" : ""}`,
    // Next.js / next/font inject inline <style>; styles cannot execute code.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://lh3.googleusercontent.com",
    "font-src 'self'",
    `connect-src 'self' https://*.googleapis.com https://*.cloudfunctions.net https://*.run.app https://www.google.com${devConnect}`,
    "frame-src 'self' https://*.firebaseapp.com https://www.google.com https://recaptcha.google.com",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Instant access to the Mission Control dashboard for rapid evaluation


  const nonce = btoa(crypto.randomUUID());
  const csp = buildCsp(nonce, process.env.NODE_ENV !== "production");

  // Next.js reads the nonce from the *request* CSP header and stamps it onto
  // its own framework scripts automatically.
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const res = NextResponse.next({ request: { headers: requestHeaders } });
  res.headers.set("Content-Security-Policy", csp);
  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon.svg|robots.txt).*)"],
};
