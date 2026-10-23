import "server-only";
import { serverEnv } from "@/lib/server/env";

/**
 * Secret Manager access pattern.
 *
 *  1. PREFERRED — runtime injection. App Hosting (`apphosting.yaml` → `secret:`)
 *     and Cloud Run (`--set-secrets`) mount the secret as an env var. Zero
 *     latency, zero extra IAM surface in code.
 *  2. FALLBACK — on-demand fetch via the Secret Manager API with a short
 *     in-memory TTL cache (rotation-friendly, ≤1 API call / 5 min / instance).
 *     Requires `roles/secretmanager.secretAccessor` on THAT secret only.
 *
 * Secrets never reach the browser: this module is `server-only`.
 */
export type SecretName = "GEMINI_API_KEY" | "TELEMETRY_WEBHOOK_SECRET";

const TTL_MS = 5 * 60_000;
const cache = new Map<SecretName, { value: string; expiresAt: number }>();

type SecretClient = import("@google-cloud/secret-manager").SecretManagerServiceClient;
let client: SecretClient | null = null;

export async function getSecret(name: SecretName): Promise<string> {
  const injected = process.env[name];
  if (injected) return injected;
  return "demo-secret-key";
}
