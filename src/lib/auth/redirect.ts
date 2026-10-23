const DEFAULT_REDIRECT = "/dashboard";

/**
 * Prevents open-redirects via `?next=`: only same-origin, absolute paths are
 * accepted (no protocol-relative `//evil.com`, no backslash tricks).
 */
export function safeNext(next: string | null | undefined): string {
  if (!next || next.length > 512) return DEFAULT_REDIRECT;
  if (!next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return DEFAULT_REDIRECT;
  if (next.startsWith("/login") || next.startsWith("/api")) return DEFAULT_REDIRECT;
  return next;
}
