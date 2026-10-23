/**
 * AetherGuard — Identity & RBAC Cloud Functions (2nd gen)
 *
 *  provisionUser  (blocking, beforeUserCreated)
 *    Runs BEFORE an account is persisted. Enforces the email-domain allow-list
 *    and stamps least-privilege custom claims { role: "viewer", orgId } into
 *    the very first ID token — no race window where a user exists without a
 *    role. Requires Firebase Auth with Identity Platform (blocking functions).
 *
 *  setUserRole    (callable)
 *    Admin-only role management. Verifies the caller's *token* claims (not a
 *    Firestore doc), enforces same-org, forbids self-modification, validates
 *    input with zod, revokes the target's refresh tokens so the new role takes
 *    effect immediately, and writes an immutable audit log entry.
 */
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { logger, setGlobalOptions } from "firebase-functions/v2";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { beforeUserCreated } from "firebase-functions/v2/identity";
import { defineList, defineString } from "firebase-functions/params";
import { z } from "zod";

initializeApp();
const auth = getAuth();
const db = getFirestore();

setGlobalOptions({ region: "us-central1", maxInstances: 10, memory: "256MiB" });

// ── Parameterized config (set via `firebase functions:config` / .env.<project>)
const DEFAULT_ORG_ID = defineString("DEFAULT_ORG_ID", { default: "org-demo" });
const ALLOWED_EMAIL_DOMAINS = defineList("ALLOWED_EMAIL_DOMAINS", { default: [] });
const BOOTSTRAP_ADMIN_EMAILS = defineList("BOOTSTRAP_ADMIN_EMAILS", { default: [] });

// Kept in sync with src/lib/auth/roles.ts (separate deploy unit).
const ROLES = ["admin", "analyst", "viewer"] as const;
type Role = (typeof ROLES)[number];

const isEmulator = process.env.FUNCTIONS_EMULATOR === "true";

function normalize(list: string[]): string[] {
  return list.map((v) => v.trim().toLowerCase()).filter(Boolean);
}

async function writeAudit(
  orgId: string,
  entry: {
    actor: { type: "user" | "system"; id: string };
    event: string;
    target: string;
    details?: Record<string, unknown>;
  },
): Promise<void> {
  await db.collection(`orgs/${orgId}/auditLogs`).add({
    ...entry,
    ts: FieldValue.serverTimestamp(),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
export const provisionUser = beforeUserCreated(async (event) => {
  const user = event.data;
  if (!user) throw new HttpsError("invalid-argument", "Missing user payload.");

  const email = (user.email ?? "").toLowerCase();
  const domains = normalize(ALLOWED_EMAIL_DOMAINS.value());
  if (domains.length > 0 && !domains.some((d) => email.endsWith(`@${d}`))) {
    logger.warn("provisionUser.domain_rejected", { domain: email.split("@")[1] ?? "unknown" });
    throw new HttpsError("permission-denied", "This email domain is not authorized for AetherGuard.");
  }

  // Only a *verified* email (e.g. Google sign-in) may be auto-promoted to admin.
  const bootstrapAdmins = normalize(BOOTSTRAP_ADMIN_EMAILS.value());
  const role: Role = user.emailVerified && bootstrapAdmins.includes(email) ? "admin" : "viewer";
  const orgId = DEFAULT_ORG_ID.value();

  await db.doc(`users/${user.uid}`).set({
    uid: user.uid,
    email,
    displayName: user.displayName ?? null,
    orgId,
    role, // mirror only — authorization always reads token claims
    prefs: {},
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  await writeAudit(orgId, {
    actor: { type: "system", id: "provisionUser" },
    event: "user.provisioned",
    target: user.uid,
    details: { role },
  });
  logger.info("provisionUser.ok", { uid: user.uid, role, orgId });

  return { customClaims: { role, orgId } };
});

// ─────────────────────────────────────────────────────────────────────────────
const SetRoleInput = z
  .object({
    email: z.string().trim().toLowerCase().email().max(254),
    role: z.enum(ROLES),
  })
  .strict();

export const setUserRole = onCall(
  {
    // App Check is enforced in production; the emulator has no attestation.
    enforceAppCheck: !isEmulator,
    cors: false,
  },
  async (request) => {
    const caller = request.auth;
    if (!caller) throw new HttpsError("unauthenticated", "Sign in required.");
    if (caller.token.role !== "admin") throw new HttpsError("permission-denied", "Admin role required.");

    const callerOrg = caller.token.orgId;
    if (typeof callerOrg !== "string") throw new HttpsError("permission-denied", "Caller has no organization.");

    const parsed = SetRoleInput.safeParse(request.data);
    if (!parsed.success) throw new HttpsError("invalid-argument", "Invalid email or role.");
    const { email, role } = parsed.data;

    const target = await auth.getUserByEmail(email).catch(() => null);
    if (!target) throw new HttpsError("not-found", "No user with that email.");
    if (target.uid === caller.uid) {
      throw new HttpsError("failed-precondition", "Admins cannot change their own role.");
    }
    if (target.customClaims?.orgId !== callerOrg) {
      // Do not leak whether the user exists in another tenant.
      throw new HttpsError("not-found", "No user with that email.");
    }

    const previousRole = (target.customClaims?.role as Role | undefined) ?? null;
    await auth.setCustomUserClaims(target.uid, { ...target.customClaims, role, orgId: callerOrg });
    // Invalidate existing sessions so the new privileges apply immediately.
    await auth.revokeRefreshTokens(target.uid);

    await db.doc(`users/${target.uid}`).set(
      { role, updatedAt: FieldValue.serverTimestamp() },
      { merge: true },
    );
    await writeAudit(callerOrg, {
      actor: { type: "user", id: caller.uid },
      event: "user.role_changed",
      target: target.uid,
      details: { previousRole, role },
    });
    logger.info("setUserRole.ok", { by: caller.uid, target: target.uid, previousRole, role });

    return { uid: target.uid, role, previousRole };
  },
);
