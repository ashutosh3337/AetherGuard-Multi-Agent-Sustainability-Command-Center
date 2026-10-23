import "server-only";

export interface ServerEnv {
  FIREBASE_PROJECT_ID: string;
  SESSION_COOKIE_MAX_AGE_DAYS: number;
  APP_CHECK_ENFORCE: boolean;
  ALLOWED_ORIGINS: string[];
}

let cached: ServerEnv | null = null;

export function serverEnv(): ServerEnv {
  if (cached) return cached;
  const projectId =
    process.env.FIREBASE_PROJECT_ID ??
    process.env.GOOGLE_CLOUD_PROJECT ??
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ??
    "demo-aetherguard";

  const rawDays = parseInt(process.env.SESSION_COOKIE_MAX_AGE_DAYS || "5", 10);
  const days = Number.isNaN(rawDays) ? 5 : Math.max(1, Math.min(14, rawDays));

  cached = {
    FIREBASE_PROJECT_ID: projectId,
    SESSION_COOKIE_MAX_AGE_DAYS: days,
    APP_CHECK_ENFORCE: process.env.APP_CHECK_ENFORCE === "true",
    ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS || "")
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean),
  };
  return cached;
}
