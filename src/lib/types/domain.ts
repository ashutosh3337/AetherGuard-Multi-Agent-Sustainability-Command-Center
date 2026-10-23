/**
 * UI domain types. Phase 1 renders these from deterministic mock data;
 * Phase 3+ hydrates the same shapes from Firestore listeners / BigQuery APIs,
 * so components don't change.
 */
export type AgentId = "orchestrator" | "analyst" | "optimizer" | "safety" | "executor";
export type AgentStatus = "active" | "thinking" | "idle" | "degraded" | "offline";

export interface Agent {
  id: AgentId;
  name: string;
  codename: string;
  role: string;
  model: string;
  status: AgentStatus;
  currentTask: string;
  tools: string[];
  stats: {
    runs24h: number;
    avgLatencyMs: number;
    successRate: number;
    tokens24h: number;
  };
}

export type ImpactKind = "co2" | "water" | "cost" | "energy";
export type ResourceCategory = "energy" | "water" | "carbon" | "waste";
export type Severity = "info" | "low" | "medium" | "high" | "critical";
export type RiskTier = "low" | "medium" | "high";

export interface Impact {
  kind: ImpactKind;
  value: number;
}

export interface Metric {
  id: ImpactKind;
  label: string;
  value: number;
  deltaPct: number;
  caption: string;
  trend: number[];
  breakdown: { label: string; value: number }[];
}

export type ActivityKind = "analysis" | "plan" | "safety" | "execution" | "alert";

export interface ActivityItem {
  id: string;
  agentId: AgentId;
  kind: ActivityKind;
  title: string;
  detail: string;
  at: number;
  runId: string;
  impact?: Impact;
}

export interface Insight {
  id: string;
  category: ResourceCategory;
  severity: Severity;
  title: string;
  summary: string;
  confidence: number;
  facility: string;
  agentId: AgentId;
  status: "new" | "in_review" | "actioned";
  projected: Impact[];
}

export interface PendingAction {
  id: string;
  title: string;
  facility: string;
  risk: RiskTier;
  proposedBy: AgentId;
  safety: "cleared" | "needs_review";
  projected: Impact[];
}

export interface LedgerEntry {
  id: string;
  action: string;
  facility: string;
  category: ResourceCategory;
  verifiedOn: string;
  impacts: Impact[];
}

export interface SystemHealth {
  status: "nominal" | "degraded" | "critical";
  latencyMs: number;
  uptimePct: number;
  eventsPerMin: number;
  nextCycleInSec: number;
  cycle: number;
}

export interface TelemetrySeries {
  category: ResourceCategory;
  unit: string;
  labels: string[];
  actual: number[];
  baseline: number[];
}
