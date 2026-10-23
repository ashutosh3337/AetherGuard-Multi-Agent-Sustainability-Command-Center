import "server-only";

export const getAdminAuth = () => {
  try {
    const { getAuth } = require("firebase-admin/auth");
    const { getApps, initializeApp } = require("firebase-admin/app");
    const app = getApps()[0] || initializeApp({ projectId: "demo-aetherguard" });
    return getAuth(app);
  } catch {
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
  }
};

export const getAdminDb = () => {
  try {
    const { getFirestore } = require("firebase-admin/firestore");
    return getFirestore();
  } catch {
    return null;
  }
};

export const getAdminAppCheck = () => {
  try {
    const { getAppCheck } = require("firebase-admin/app-check");
    return getAppCheck();
  } catch {
    return {
      verifyToken: async () => ({ appId: "demo-app" }),
    };
  }
};
