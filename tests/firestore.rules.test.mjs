/**
 * Firestore security rules tests.
 *   npm run test:rules   (boots the Firestore emulator automatically)
 */
import { readFileSync } from "node:fs";
import { after, before, beforeEach, describe, it } from "node:test";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";

let env;
const ORG = "org-a";
const OTHER = "org-b";

const as = (uid, role, orgId = ORG) => env.authenticatedContext(uid, { role, orgId }).firestore();

before(async () => {
  env = await initializeTestEnvironment({
    projectId: "demo-aetherguard",
    firestore: { rules: readFileSync("firestore.rules", "utf8") },
  });
});

beforeEach(async () => {
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    await setDoc(doc(db, `orgs/${ORG}/facilities/f1`), { name: "Plant A" });
    await setDoc(doc(db, `orgs/${OTHER}/facilities/f9`), { name: "Other" });
    await setDoc(doc(db, `orgs/${ORG}/auditLogs/l1`), { event: "x" });
    await setDoc(doc(db, `orgs/${ORG}/alerts/a1`), { severity: "high" });
    await setDoc(doc(db, `orgs/${ORG}/agentRuns/r1`), { status: "done" });
    await setDoc(doc(db, "users/u1"), { role: "viewer", orgId: ORG, prefs: {} });
  });
});

after(async () => env?.cleanup());

describe("tenant isolation", () => {
  it("denies unauthenticated reads", async () => {
    await assertFails(getDoc(doc(env.unauthenticatedContext().firestore(), `orgs/${ORG}/facilities/f1`)));
  });
  it("allows members to read their org", async () => {
    await assertSucceeds(getDoc(doc(as("u1", "viewer"), `orgs/${ORG}/facilities/f1`)));
  });
  it("denies cross-org reads", async () => {
    await assertFails(getDoc(doc(as("u1", "viewer"), `orgs/${OTHER}/facilities/f9`)));
  });
  it("denies users without a role claim", async () => {
    const db = env.authenticatedContext("u2", { orgId: ORG }).firestore();
    await assertFails(getDoc(doc(db, `orgs/${ORG}/facilities/f1`)));
  });
});

describe("agent data is read-only", () => {
  it("blocks even admins from writing agent runs", async () => {
    await assertFails(setDoc(doc(as("a1", "admin"), `orgs/${ORG}/agentRuns/r2`), { status: "done" }));
  });
});

describe("audit logs", () => {
  it("viewer cannot read", async () => {
    await assertFails(getDoc(doc(as("u1", "viewer"), `orgs/${ORG}/auditLogs/l1`)));
  });
  it("admin can read", async () => {
    await assertSucceeds(getDoc(doc(as("a1", "admin"), `orgs/${ORG}/auditLogs/l1`)));
  });
  it("admin cannot tamper", async () => {
    await assertFails(updateDoc(doc(as("a1", "admin"), `orgs/${ORG}/auditLogs/l1`), { event: "y" }));
  });
});

describe("alerts acknowledgement", () => {
  it("analyst can ack with own uid + server time", async () => {
    await assertSucceeds(
      updateDoc(doc(as("an1", "analyst"), `orgs/${ORG}/alerts/a1`), { ack: { uid: "an1", at: serverTimestamp() } }),
    );
  });
  it("viewer cannot ack", async () => {
    await assertFails(
      updateDoc(doc(as("u1", "viewer"), `orgs/${ORG}/alerts/a1`), { ack: { uid: "u1", at: serverTimestamp() } }),
    );
  });
  it("analyst cannot spoof another uid or edit severity", async () => {
    const db = as("an1", "analyst");
    await assertFails(updateDoc(doc(db, `orgs/${ORG}/alerts/a1`), { ack: { uid: "zz", at: serverTimestamp() } }));
    await assertFails(updateDoc(doc(db, `orgs/${ORG}/alerts/a1`), { severity: "low" }));
  });
});

describe("user profile", () => {
  it("user can update whitelisted prefs", async () => {
    await assertSucceeds(
      updateDoc(doc(as("u1", "viewer"), "users/u1"), { prefs: { timeRange: "7d" }, updatedAt: serverTimestamp() }),
    );
  });
  it("user cannot escalate role", async () => {
    await assertFails(updateDoc(doc(as("u1", "viewer"), "users/u1"), { role: "admin" }));
  });
  it("user cannot read another profile", async () => {
    await assertFails(getDoc(doc(as("u2", "viewer"), "users/u1")));
  });
});
