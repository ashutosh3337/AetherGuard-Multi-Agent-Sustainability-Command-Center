#!/usr/bin/env node
/**
 * Bootstrap / break-glass role assignment.
 *
 *   npm run set-role -- <email> <admin|analyst|viewer> [orgId]
 *
 * Uses Application Default Credentials — NO service-account key files.
 *   • Emulator:  export FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 (auto from .env.local)
 *   • Real proj: gcloud auth application-default login  (needs Firebase Auth Admin)
 */
import { readFileSync, existsSync } from "node:fs";
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

// Minimal .env.local loader (no dependency).
if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2];
  }
}

const ROLES = ["admin", "analyst", "viewer"];
const [email, role, orgId = "org-demo"] = process.argv.slice(2);

if (!email || !ROLES.includes(role)) {
  console.error("Usage: npm run set-role -- <email> <admin|analyst|viewer> [orgId]");
  process.exit(1);
}

const projectId = process.env.FIREBASE_PROJECT_ID ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const usingEmulator = Boolean(process.env.FIREBASE_AUTH_EMULATOR_HOST);
initializeApp(usingEmulator ? { projectId } : { credential: applicationDefault(), projectId });

const user = await getAuth().getUserByEmail(email.toLowerCase());
await getAuth().setCustomUserClaims(user.uid, { ...user.customClaims, role, orgId });
await getAuth().revokeRefreshTokens(user.uid);
await getFirestore()
  .doc(`users/${user.uid}`)
  .set({ uid: user.uid, email: user.email, role, orgId, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
await getFirestore().collection(`orgs/${orgId}/auditLogs`).add({
  actor: { type: "system", id: "cli:set-role" },
  event: "user.role_changed",
  target: user.uid,
  details: { role },
  ts: FieldValue.serverTimestamp(),
});

console.log(`✔ ${email} → role=${role}, orgId=${orgId}${usingEmulator ? " (emulator)" : ""}. User must sign in again.`);
process.exit(0);
