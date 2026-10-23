"use client";

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import {
  getToken,
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
  type AppCheck,
} from "firebase/app-check";
import {
  browserLocalPersistence,
  browserPopupRedirectResolver,
  connectAuthEmulator,
  getAuth,
  indexedDBLocalPersistence,
  initializeAuth,
  type Auth,
} from "firebase/auth";
import {
  connectFirestoreEmulator,
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  type Firestore,
} from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions, type Functions } from "firebase/functions";
import { clientEnv } from "@/lib/env.client";

/**
 * Browser Firebase singleton.
 *
 * PERFORMANCE: this module is *dynamically imported* (`loadFirebase()`), so the
 * ~100 KB Firebase SDK is kept off the critical rendering path of the shell.
 * The instance is cached on `globalThis` so Fast Refresh never double-inits.
 *
 * SECURITY: App Check is initialised FIRST so every Auth / Firestore /
 * Functions request carries an attestation token. With enforcement enabled in
 * the console, requests from scripts, bots or cloned apps are rejected.
 */
export interface FirebaseClients {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  functions: Functions;
  appCheck: AppCheck | null;
}

const globalForFirebase = globalThis as unknown as { __aetherFirebase?: FirebaseClients };

export function getFirebase(): FirebaseClients {
  if (typeof window === "undefined") {
    throw new Error("getFirebase() is browser-only. Use firebase-admin on the server.");
  }
  if (globalForFirebase.__aetherFirebase) return globalForFirebase.__aetherFirebase;

  const app = getApps().length
    ? getApp()
    : initializeApp({
        apiKey: clientEnv.apiKey,
        authDomain: clientEnv.authDomain,
        projectId: clientEnv.projectId,
        appId: clientEnv.appId,
        storageBucket: clientEnv.storageBucket,
        messagingSenderId: clientEnv.messagingSenderId,
      });

  // ── App Check ──────────────────────────────────────────────────────────────
  let appCheck: AppCheck | null = null;
  if (clientEnv.recaptchaSiteKey) {
    if (clientEnv.appCheckDebug) {
      // Prints a debug token to the console; register it in the Firebase console.
      (self as unknown as { FIREBASE_APPCHECK_DEBUG_TOKEN: boolean }).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    }
    appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(clientEnv.recaptchaSiteKey),
      isTokenAutoRefreshEnabled: true,
    });
  }

  // ── Auth ───────────────────────────────────────────────────────────────────
  // IndexedDB persistence keeps the client SDK signed in for Firestore
  // listeners; the *server* trusts only the httpOnly session cookie.
  let auth: Auth;
  try {
    auth = initializeAuth(app, {
      persistence: [indexedDBLocalPersistence, browserLocalPersistence],
      popupRedirectResolver: browserPopupRedirectResolver,
    });
  } catch {
    auth = getAuth(app);
  }

  // ── Firestore ──────────────────────────────────────────────────────────────
  // Persistent multi-tab cache → instant warm loads and fewer billed reads.
  let db: Firestore;
  try {
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
    });
  } catch {
    db = getFirestore(app);
  }

  const functions = getFunctions(app, clientEnv.functionsRegion);

  if (clientEnv.useEmulators) {
    const host = clientEnv.emulatorHost;
    if (!auth.emulatorConfig) connectAuthEmulator(auth, `http://${host}:9099`, { disableWarnings: true });
    connectFirestoreEmulator(db, host, 8080);
    connectFunctionsEmulator(functions, host, 5001);
  }

  globalForFirebase.__aetherFirebase = { app, auth, db, functions, appCheck };
  return globalForFirebase.__aetherFirebase;
}

/** Returns a (cached) App Check token for calls to our own API, or null if disabled. */
export async function getAppCheckToken(): Promise<string | null> {
  const { appCheck } = getFirebase();
  if (!appCheck) return null;
  try {
    const { token } = await getToken(appCheck, false);
    return token;
  } catch {
    return null;
  }
}
