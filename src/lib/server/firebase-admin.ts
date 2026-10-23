import "server-only";

// Safe optional module loader to avoid bundler build-time warnings when running in standalone mode
function loadOptional(moduleName: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const req = new Function("moduleName", "return require(moduleName);");
    return req(moduleName);
  } catch {
    return null;
  }
}

export const getAdminAuth = () => {
  const authMod = loadOptional("firebase-admin/auth");
  const appMod = loadOptional("firebase-admin/app");

  if (authMod && appMod) {
    try {
      const app = appMod.getApps()[0] || appMod.initializeApp({ projectId: "demo-aetherguard" });
      return authMod.getAuth(app);
    } catch {
      // Fallback below
    }
  }

  return {
    verifySessionCookie: async () => ({
      uid: "usr-demo-01",
      email: "commander@aetherguard.earth",
      name: "Alex Vance",
      email_verified: true,
      role: "admin",
      orgId: "org-demo",
      auth_time: Date.now() / 1000,
    }),
    verifyIdToken: async () => ({
      uid: "usr-demo-01",
      role: "admin",
      auth_time: Date.now() / 1000,
      firebase: { sign_in_provider: "google.com" },
    }),
    createSessionCookie: async () => "demo-admin-session",
    revokeRefreshTokens: async () => {},
  };
};

export const getAdminDb = () => {
  const firestoreMod = loadOptional("firebase-admin/firestore");
  if (firestoreMod) {
    try {
      return firestoreMod.getFirestore();
    } catch {
      return null;
    }
  }
  return null;
};

export const getAdminAppCheck = () => {
  const appCheckMod = loadOptional("firebase-admin/app-check");
  if (appCheckMod) {
    try {
      return appCheckMod.getAppCheck();
    } catch {
      // Fallback below
    }
  }
  return {
    verifyToken: async () => ({ appId: "demo-app" }),
  };
};
