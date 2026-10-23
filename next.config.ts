import type { NextConfig } from "next";

/**
 * Static security headers applied to every response.
 * The Content-Security-Policy is NOT set here — it needs a per-request nonce,
 * so it is generated in `src/middleware.ts`.
 */
const securityHeaders = [
  // Force HTTPS for 2 years incl. subdomains (Cloud Run / App Hosting terminate TLS).
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  // `same-origin-allow-popups` is required for Firebase signInWithPopup (Google).
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Minimal self-contained server bundle → small container image, fast Cloud Run cold starts.
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    // Tree-shake icon imports so only the icons we render ship to the client.
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "lh3.googleusercontent.com" }],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
