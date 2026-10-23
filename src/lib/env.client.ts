export interface ClientEnv {
  apiKey: string;
  authDomain: string;
  projectId: string;
  appId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  functionsRegion: string;
  recaptchaSiteKey?: string;
  appCheckDebug: boolean;
  useEmulators: boolean;
  emulatorHost: string;
}

const blankToUndefined = (v: string | undefined) => (v && v.trim() !== "" ? v : undefined);

export const clientEnv: ClientEnv = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-aetherguard.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-aetherguard",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:000000000000:web:0000000000000000",
  storageBucket: blankToUndefined(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: blankToUndefined(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
  functionsRegion: process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION ?? "us-central1",
  recaptchaSiteKey: blankToUndefined(process.env.NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY),
  appCheckDebug: process.env.NEXT_PUBLIC_APP_CHECK_DEBUG === "true",
  useEmulators: process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true",
  emulatorHost: process.env.NEXT_PUBLIC_EMULATOR_HOST ?? "127.0.0.1",
};
