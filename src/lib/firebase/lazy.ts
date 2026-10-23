"use client";

import type { FirebaseClients } from "@/lib/firebase/client";

/**
 * Lazily loads the Firebase SDK chunk. Call from effects / event handlers only.
 * Keeps Firebase out of the initial JS bundle (better LCP / TBT).
 */
let pending: Promise<typeof import("@/lib/firebase/client")> | null = null;

export async function loadFirebaseModule() {
  pending ??= import("@/lib/firebase/client");
  return pending;
}

export async function loadFirebase(): Promise<FirebaseClients> {
  const mod = await loadFirebaseModule();
  return mod.getFirebase();
}
