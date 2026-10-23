/**
 * AetherGuard Autonomous Domain Types & Schemas
 *
 * Designed for enterprise sustainability operations, multi-agent Blackboard topologies,
 * BigQuery telemetry partitioning, and ASHRAE 55 / IEEE 519 compliance verification.
 *
 * Built for "Build Beyond AI: Engineer Secure, Intelligent and Autonomous Applications"
 */

/** Specialized agent roles in the Supervised Blackboard constellation */
export type AgentId = "orchestrator" | "analyst" | "optimizer" | "safety" | "executor";

/** Real-time operational lifecycle states for autonomous agents */
export type AgentStatus = "active" | "thinking" | "idle" | "degraded" | "offline";

/**
 * Autonomous Agent entity representing a specialized reasoning model in Vertex AI.
 */
export interface Agent {
  /** Unique agent identifier */
  id: AgentId;
  /** Human-readable agent title */
  name: string;
  /** Operational radio callsign */
  codename: string;
  /** Primary systemic responsibility */
  role: string;
  /** Underlying Google Gemini foundation model */
  model: "Gemini 2.5 Pro" | "Gemini 2.5 Flash" | string;
  /** Live operational state */
  status: AgentStatus;
  /** Current active reasoning task or sub-goal */
  currentTask: string;
  /** Whitelisted tool calls callable by this agent */
  tools: string[];
  /** Execution and performance telemetry */
  stats: {
    runs24h: number;
    avgLatencyMs: number;
    successRate: number;
    tokens24h: number;
  };
}

/** Specific resource impact vectors tracked by AetherGuard */
export type ImpactKind = "co2" | "water" | "cost" | "energy";

/** Environmental resource classification */
export type ResourceCategory = "energy" | "water" | "carbon" | "waste";

/** Anomaly and alert prioritization */
export type Severity = "info" | "low" | "medium" | "high" | "critical";

/** Intervention risk classification requiring human gate or automated dispatch */
export type RiskTier = "low" | "medium" | "high";

/** Quantitative environmental impact measure */
export interface Impact {
  kind: ImpactKind;
  value: number;
}

/** Metric card view model for live dashboard indicators */
export interface Metric {
  id: ImpactKind;
  label: string;
  value: number;
  deltaPct: number;
  caption: string;
  trend: number[];
  breakdown: { label: string; value: number }[];
}

/** Taxonomy of agent reasoning and stream actions */
export type ActivityKind = "analysis" | "plan" | "safety" | "execution" | "alert";

/** Activity stream event captured in the Blackboard audit log */
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

/** Anomaly diagnostic discovered through BigQuery time-series analysis */
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

/** Action requiring human sign-off before physical actuator commands are dispatched */
export interface PendingAction {
  id: string;
  title: string;
  facility: string;
  risk: RiskTier;
  proposedBy: AgentId;
  safety: "cleared" | "needs_review";
  projected: Impact[];
}

/** Tamper-evident ledger entry in the verified ESG audit chain */
export interface LedgerEntry {
  id: string;
  action: string;
  facility: string;
  category: ResourceCategory;
  verifiedOn: string;
  impacts: Impact[];
}

/** Global command center health and telemetry pipeline indicators */
export interface SystemHealth {
  status: "nominal" | "degraded" | "critical";
  latencyMs: number;
  uptimePct: number;
  eventsPerMin: number;
  nextCycleInSec: number;
  cycle: number;
}

/** Baseline vs Actuated telemetric comparison series for SVG rendering */
export interface TelemetrySeries {
  category: ResourceCategory;
  unit: string;
  labels: string[];
  actual: number[];
  baseline: number[];
}

/** Single step in the multi-agent consensus sequence executed on demand */
export interface AgentReasoningStep {
  agentId: AgentId;
  codename: string;
  agentName: string;
  model: string;
  action: string;
  detail: string;
  toolCall: string;
  verdict: "analyzing" | "optimized" | "verified" | "dispatched";
}
