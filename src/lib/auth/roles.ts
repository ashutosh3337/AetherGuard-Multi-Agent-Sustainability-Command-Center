/**
 * Role-based access control model.
 *
 * Roles are carried as Firebase custom claims (`role`, `orgId`) and are only
 * ever set server-side (Cloud Function / admin CLI). The client uses this map
 * purely for UX (hiding controls); the *enforcement* lives in Firestore rules,
 * Cloud Functions and the API layer.
 */
export const ROLES = ["admin", "analyst", "viewer"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_META: Record<Role, { label: string; description: string }> = {
  admin: { label: "Admin", description: "Full control: users, policies, agent autonomy, audit." },
  analyst: { label: "Analyst", description: "Investigate insights, review and approve agent actions." },
  viewer: { label: "Viewer", description: "Read-only access to dashboards and impact reports." },
};

export const PERMISSIONS = {
  "dashboard:view": ["admin", "analyst", "viewer"],
  "insights:view": ["admin", "analyst", "viewer"],
  "impact:view": ["admin", "analyst", "viewer"],
  "actions:review": ["admin", "analyst"],
  "missions:launch": ["admin", "analyst"],
  "alerts:ack": ["admin", "analyst"],
  "agents:control": ["admin"],
  "policies:edit": ["admin"],
  "users:manage": ["admin"],
  "audit:view": ["admin"],
} as const satisfies Record<string, readonly Role[]>;

export type Permission = keyof typeof PERMISSIONS;

export function can(role: Role, permission: Permission): boolean {
  return (PERMISSIONS[permission] as readonly Role[]).includes(role);
}

/** Unknown / missing claims collapse to the least-privileged role. */
export function parseRole(value: unknown): Role {
  return (ROLES as readonly string[]).includes(value as string) ? (value as Role) : "viewer";
}

export interface SessionUser {
  uid: string;
  email: string | null;
  name: string | null;
  picture: string | null;
  emailVerified: boolean;
  role: Role;
  orgId: string | null;
}
