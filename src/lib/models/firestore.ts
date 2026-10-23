import { z } from "zod";
import type {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";
import { ROLES } from "@/lib/auth/roles";

/**
 * Firestore data models (source of truth for document shapes).
 *
 * Every read goes through a zod-validating converter: malformed or tampered
 * documents are rejected at the boundary instead of crashing UI code.
 * Paths mirror firestore.rules exactly.
 */

// ── Paths ────────────────────────────────────────────────────────────────────
export const paths = {
  user: (uid: string) => `users/${uid}`,
  org: (orgId: string) => `orgs/${orgId}`,
  facilities: (orgId: string) => `orgs/${orgId}/facilities`,
  agentRuns: (orgId: string) => `orgs/${orgId}/agentRuns`,
  runSteps: (orgId: string, runId: string) => `orgs/${orgId}/agentRuns/${runId}/steps`,
  actions: (orgId: string) => `orgs/${orgId}/actions`,
  alerts: (orgId: string) => `orgs/${orgId}/alerts`,
  memories: (orgId: string) => `orgs/${orgId}/memories`,
  policies: (orgId: string) => `orgs/${orgId}/policies`,
  auditLogs: (orgId: string) => `orgs/${orgId}/auditLogs`,
} as const;

// Firestore Timestamp → Date (duck-typed so it works with client + admin SDKs).
const timestamp = z
  .custom<{ toDate: () => Date }>((v) => typeof (v as { toDate?: unknown })?.toDate === "function")
  .transform((t) => t.toDate());

const agentId = z.enum(["orchestrator", "analyst", "optimizer", "safety", "executor"]);
const category = z.enum(["energy", "water", "carbon", "waste"]);
const impact = z.object({ co2Kg: z.number(), waterL: z.number(), costUsd: z.number(), energyKwh: z.number() }).partial();

// ── Schemas ──────────────────────────────────────────────────────────────────
export const UserDoc = z.object({
  uid: z.string(),
  email: z.string().email(),
  displayName: z.string().nullable(),
  orgId: z.string(),
  role: z.enum(ROLES),
  prefs: z
    .object({
      sidebarCollapsed: z.boolean(),
      contextPanelOpen: z.boolean(),
      timeRange: z.enum(["24h", "7d", "30d"]),
      defaultFacilityId: z.string().max(64),
    })
    .partial()
    .default({}),
  createdAt: timestamp.optional(),
  updatedAt: timestamp.optional(),
});

export const FacilityDoc = z.object({
  name: z.string(),
  type: z.enum(["campus", "plant", "datacenter", "warehouse"]),
  location: z.object({ lat: z.number(), lng: z.number(), region: z.string() }),
  baseline: z.object({ energyKwh: z.number(), waterL: z.number(), co2Kg: z.number() }),
  equipment: z.array(z.string()).default([]),
});

export const AgentRunDoc = z.object({
  trigger: z.enum(["schedule", "anomaly", "user"]),
  goal: z.string(),
  status: z.enum(["planning", "running", "awaiting_approval", "done", "failed"]),
  plan: z.array(
    z.object({
      taskId: z.string(),
      agent: agentId,
      dependsOn: z.array(z.string()),
      status: z.enum(["pending", "running", "done", "failed", "skipped"]),
    }),
  ),
  metrics: z.object({ latencyMs: z.number(), tokensIn: z.number(), tokensOut: z.number(), costUsd: z.number() }).partial(),
  startedAt: timestamp,
  endedAt: timestamp.nullable().optional(),
});

export const RunStepDoc = z.object({
  agent: agentId,
  type: z.enum(["thought", "tool_call", "result", "decision"]),
  payload: z.record(z.unknown()),
  ts: timestamp,
});

export const ActionDoc = z.object({
  runId: z.string(),
  facilityId: z.string(),
  title: z.string(),
  category,
  risk: z.enum(["low", "medium", "high"]),
  projected: impact,
  actual: impact.optional(),
  status: z.enum(["proposed", "approved", "rejected", "executing", "verified", "rolled_back"]),
  safetyVerdict: z.object({ decision: z.enum(["approve", "reject", "require_human"]), reasons: z.array(z.string()) }),
  approvals: z.array(z.object({ uid: z.string(), at: timestamp })).default([]),
  createdAt: timestamp,
});

export const AlertDoc = z.object({
  severity: z.enum(["info", "low", "medium", "high", "critical"]),
  metric: z.string(),
  facilityId: z.string(),
  message: z.string(),
  ack: z.object({ uid: z.string(), at: timestamp }).nullable().optional(),
  createdAt: timestamp,
});

export const AuditLogDoc = z.object({
  actor: z.object({ type: z.enum(["user", "agent", "system"]), id: z.string() }),
  event: z.string(),
  target: z.string(),
  model: z.string().optional(),
  promptHash: z.string().optional(),
  decision: z.string().optional(),
  rationale: z.string().optional(),
  details: z.record(z.unknown()).optional(),
  ts: timestamp,
});

export type UserDoc = z.infer<typeof UserDoc>;
export type FacilityDoc = z.infer<typeof FacilityDoc>;
export type AgentRunDoc = z.infer<typeof AgentRunDoc>;
export type RunStepDoc = z.infer<typeof RunStepDoc>;
export type ActionDoc = z.infer<typeof ActionDoc>;
export type AlertDoc = z.infer<typeof AlertDoc>;
export type AuditLogDoc = z.infer<typeof AuditLogDoc>;

/**
 * Read-only converter. `toFirestore` throws on purpose: clients never write
 * these collections (rules deny it anyway — this catches mistakes at dev time).
 */
export function readOnlyConverter<S extends z.ZodTypeAny>(schema: S): FirestoreDataConverter<z.output<S> & { id: string }> {
  return {
    toFirestore(): DocumentData {
      throw new Error("This collection is server-written only.");
    },
    fromFirestore(snap: QueryDocumentSnapshot, options?: SnapshotOptions) {
      return { ...schema.parse(snap.data(options)), id: snap.id };
    },
  };
}
