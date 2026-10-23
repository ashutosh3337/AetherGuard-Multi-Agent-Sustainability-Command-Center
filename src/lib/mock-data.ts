import type {
  ActivityItem,
  Agent,
  Insight,
  LedgerEntry,
  Metric,
  PendingAction,
  SystemHealth,
  TelemetrySeries,
} from "@/lib/types/domain";

export const MOCK_SYSTEM_HEALTH: SystemHealth = {
  status: "nominal",
  latencyMs: 142,
  uptimePct: 99.98,
  eventsPerMin: 1840,
  nextCycleInSec: 428,
  cycle: 1429,
};

export const MOCK_AGENTS: Agent[] = [
  {
    id: "orchestrator",
    name: "Aether Orchestrator",
    codename: "ATLAS-01",
    role: "Global Planning & Task Decomposition",
    model: "Gemini 2.5 Pro",
    status: "active",
    currentTask: "Synthesizing cross-facility load shift strategies for peak carbon hours",
    tools: ["decompose_goal", "route_to_agent", "recall_memory", "publish_plan"],
    stats: {
      runs24h: 96,
      avgLatencyMs: 640,
      successRate: 99.1,
      tokens24h: 384000,
    },
  },
  {
    id: "analyst",
    name: "Data Analyst",
    codename: "CHRONOS-02",
    role: "BigQuery Telemetry & Baseline Anomaly Detection",
    model: "Gemini 2.5 Flash",
    status: "thinking",
    currentTask: "Evaluating chilled-water delta T anomalies in Plant Beta Substation 4",
    tools: ["bq_query_template", "detect_anomalies", "calc_variance"],
    stats: {
      runs24h: 384,
      avgLatencyMs: 310,
      successRate: 99.8,
      tokens24h: 512000,
    },
  },
  {
    id: "optimizer",
    name: "Resource Optimizer",
    codename: "PROMETHEUS-03",
    role: "Algorithmic Intervention & Carbon Impact Projection",
    model: "Gemini 2.5 Flash",
    status: "active",
    currentTask: "Simulating HVAC precooling schedule vs grid carbon intensity forecast",
    tools: ["simulate_intervention", "query_grid_carbon", "rank_interventions"],
    stats: {
      runs24h: 192,
      avgLatencyMs: 420,
      successRate: 98.6,
      tokens24h: 298000,
    },
  },
  {
    id: "safety",
    name: "Safety & Compliance",
    codename: "AEGIS-04",
    role: "Policy Bounds, Blast Radius & Regulatory Enforcement",
    model: "Gemini 2.5 Pro",
    status: "active",
    currentTask: "Verifying ASHRAE 55 thermal comfort envelopes for proposed setpoint delta",
    tools: ["check_policy", "check_bounds", "require_human_gate"],
    stats: {
      runs24h: 180,
      avgLatencyMs: 580,
      successRate: 100.0,
      tokens24h: 245000,
    },
  },
  {
    id: "executor",
    name: "Autonomous Executor",
    codename: "HERMES-05",
    role: "Targeted Actuator Dispatch & Closed-Loop Verification",
    model: "Gemini 2.5 Flash",
    status: "idle",
    currentTask: "Awaiting approval for pump VFD frequency modulation",
    tools: ["dispatch_bacnet", "dispatch_modbus", "verify_telemetry", "emergency_rollback"],
    stats: {
      runs24h: 74,
      avgLatencyMs: 240,
      successRate: 98.9,
      tokens24h: 124000,
    },
  },
];

export const MOCK_METRICS: Metric[] = [
  {
    id: "co2",
    label: "CO₂e Avoided",
    value: 148.6,
    deltaPct: 18.4,
    caption: "vs. 30-day baseline projection",
    trend: [112, 118, 124, 131, 135, 142, 148.6],
    breakdown: [
      { label: "Grid Curtailment", value: 68.2 },
      { label: "Chiller VFD Optimization", value: 52.1 },
      { label: "Night Purge Cooling", value: 28.3 },
    ],
  },
  {
    id: "energy",
    label: "Energy Optimized",
    value: 412.8,
    deltaPct: 14.2,
    caption: "MWh aggregate reduction across 4 facilities",
    trend: [340, 355, 368, 382, 395, 404, 412.8],
    breakdown: [
      { label: "Facility Alpha (Campus)", value: 184.2 },
      { label: "Plant Beta (Fab)", value: 142.6 },
      { label: "Omega Datacenter", value: 86.0 },
    ],
  },
  {
    id: "water",
    label: "Water Conserved",
    value: 8420,
    deltaPct: 22.8,
    caption: "kL saved via closed-loop evaporative cycles",
    trend: [6200, 6600, 7100, 7450, 7900, 8150, 8420],
    breakdown: [
      { label: "Cooling Towers Cycle Optimization", value: 5640 },
      { label: "Greywater Recirculation", value: 2780 },
    ],
  },
  {
    id: "cost",
    label: "Operating Cost Saved",
    value: 58240,
    deltaPct: 16.5,
    caption: "USD net realized savings this billing cycle",
    trend: [41000, 44200, 48000, 51500, 54200, 56800, 58240],
    breakdown: [
      { label: "Time-of-Use Arbitrage", value: 29400 },
      { label: "Peak Demand Charge Reduction", value: 19800 },
      { label: "Water Tariff Reductions", value: 9040 },
    ],
  },
];

export const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: "act-101",
    agentId: "safety",
    kind: "safety",
    title: "Thermal envelope safety check passed",
    detail: "Validated proposed +1.2°C AHU-4 temperature drift against ASHRAE Standard 55; comfort index score 94.2%.",
    at: Date.now() - 45_000,
    runId: "run-882",
  },
  {
    id: "act-102",
    agentId: "optimizer",
    kind: "plan",
    title: "Generated precooling intervention schedule",
    detail: "Orchestrating 350 kW load shift from 15:00 to 12:30 ahead of projected 420g/kWh grid carbon spike.",
    at: Date.now() - 140_000,
    runId: "run-882",
    impact: { kind: "co2", value: 4.8 },
  },
  {
    id: "act-103",
    agentId: "analyst",
    kind: "analysis",
    title: "Chiller #3 Delta T syndrome detected",
    detail: "BigQuery 15m aggregate identified bypass flow of 140 gpm causing 18% thermal efficiency degradation in Plant Beta.",
    at: Date.now() - 320_000,
    runId: "run-881",
  },
  {
    id: "act-104",
    agentId: "executor",
    kind: "execution",
    title: "Modulated Cooling Tower 2 VFD to 44 Hz",
    detail: "Actuated actuator CT-VFD-02 via secure gateway. Telemetry confirms pump power drop of 18.2 kW with 0°C penalty.",
    at: Date.now() - 720_000,
    runId: "run-880",
    impact: { kind: "energy", value: 1.2 },
  },
  {
    id: "act-105",
    agentId: "orchestrator",
    kind: "plan",
    title: "Autonomous 15-minute sustainability cycle completed",
    detail: "Analyzed 1,420 sensors across 3 facilities. 2 low-risk optimizations executed; 1 medium-risk queued for operator signoff.",
    at: Date.now() - 900_000,
    runId: "run-879",
  },
];

export const MOCK_INSIGHTS: Insight[] = [
  {
    id: "ins-01",
    category: "energy",
    severity: "high",
    title: "Peak Carbon Grid Arbitrage Opportunity",
    summary:
      "Regional CAISO grid carbon intensity forecast to jump from 185g to 430g CO₂e/kWh between 16:00 and 19:30. Facility thermal mass can safely store 4.2 MWh of chilled energy beforehand.",
    confidence: 0.94,
    facility: "Campus Alpha",
    agentId: "optimizer",
    status: "in_review",
    projected: [
      { kind: "co2", value: 3.4 },
      { kind: "cost", value: 1420 },
    ],
  },
  {
    id: "ins-02",
    category: "water",
    severity: "medium",
    title: "Evaporative Cooling Cycles of Concentration Alert",
    summary:
      "Cooling tower conductivity sensors indicate cycle concentration can safely increase from 4.2 to 5.8 without scale deposition risk based on Langelier Saturation Index.",
    confidence: 0.91,
    facility: "Plant Beta (Fab)",
    agentId: "analyst",
    status: "new",
    projected: [
      { kind: "water", value: 1250 },
      { kind: "cost", value: 680 },
    ],
  },
  {
    id: "ins-03",
    category: "carbon",
    severity: "low",
    title: "Off-Hours Standby Server Rack Decommissioning",
    summary:
      "Omega Datacenter Pod 4 is operating at 9% compute load while drawing 22 kW baseline power. Orchestrator recommends workload consolidation into Pod 2.",
    confidence: 0.98,
    facility: "Omega Datacenter",
    agentId: "orchestrator",
    status: "actioned",
    projected: [
      { kind: "co2", value: 1.8 },
      { kind: "energy", value: 5.2 },
    ],
  },
];

export const MOCK_PENDING_ACTIONS: PendingAction[] = [
  {
    id: "act-p-01",
    title: "Shift Chiller #2 Precooling Schedule (1.5h Advance)",
    facility: "Campus Alpha (HQ)",
    risk: "medium",
    proposedBy: "optimizer",
    safety: "cleared",
    projected: [
      { kind: "co2", value: 3.4 },
      { kind: "cost", value: 1420 },
    ],
  },
  {
    id: "act-p-02",
    title: "Increase Evaporative Cooling Cycles to 5.6 CoC",
    facility: "Plant Beta (Fab)",
    risk: "low",
    proposedBy: "analyst",
    safety: "cleared",
    projected: [
      { kind: "water", value: 850 },
      { kind: "cost", value: 490 },
    ],
  },
];

export const MOCK_TELEMETRY_SERIES: TelemetrySeries = {
  category: "energy",
  unit: "kW",
  labels: ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00", "24:00"],
  baseline: [1420, 1380, 1650, 2450, 2890, 3100, 2750, 2100, 1600],
  actual: [1290, 1260, 1490, 2180, 2520, 2690, 2410, 1850, 1440],
};

export const MOCK_LEDGER_ENTRIES: LedgerEntry[] = [
  {
    id: "led-01",
    action: "Chiller Plant VFD Dynamic Balancing",
    facility: "Plant Beta",
    category: "energy",
    verifiedOn: "2026-10-22",
    impacts: [
      { kind: "energy", value: 48.2 },
      { kind: "co2", value: 18.5 },
      { kind: "cost", value: 6840 },
    ],
  },
  {
    id: "led-02",
    action: "Peak Carbon Precooling Dispatch",
    facility: "Campus Alpha",
    category: "carbon",
    verifiedOn: "2026-10-21",
    impacts: [
      { kind: "co2", value: 24.1 },
      { kind: "cost", value: 8120 },
    ],
  },
  {
    id: "led-03",
    action: "Cooling Tower Bleed-Off Automation",
    facility: "Omega Datacenter",
    category: "water",
    verifiedOn: "2026-10-20",
    impacts: [
      { kind: "water", value: 3400 },
      { kind: "cost", value: 2300 },
    ],
  },
];
