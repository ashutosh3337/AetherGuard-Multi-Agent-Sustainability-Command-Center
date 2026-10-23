"use client";

import React, { useState } from "react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { TelemetryChart } from "@/components/dashboard/TelemetryChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { ApprovalsQueue } from "@/components/dashboard/ApprovalsQueue";
import { ProblemAlignmentCard } from "@/components/dashboard/ProblemAlignmentCard";
import { AgentCycleModal } from "@/components/dashboard/AgentCycleModal";
import { Button } from "@/components/ui/Button";
import {
  MOCK_METRICS,
  MOCK_TELEMETRY_SERIES,
  MOCK_ACTIVITY,
  MOCK_PENDING_ACTIONS,
  MOCK_LEDGER_ENTRIES,
} from "@/lib/mock-data";
import type { ActivityItem, Metric } from "@/lib/types/domain";
import { Play, Download, Sparkles, RefreshCw, CheckCircle2 } from "lucide-react";
import { useCommandCenter } from "@/components/providers/CommandCenterContext";

export default function DashboardPage() {
  const { facility } = useCommandCenter();
  const [isCycleModalOpen, setIsCycleModalOpen] = useState(false);
  const [exported, setExported] = useState(false);
  const [metrics, setMetrics] = useState<Metric[]>(MOCK_METRICS);
  const [activities, setActivities] = useState<ActivityItem[]>(MOCK_ACTIVITY);

  const handleExportLedger = () => {
    const headers = "Action ID,Facility,Verified Date,Impacts,Audit Status\n";
    const rows = MOCK_LEDGER_ENTRIES.map((e) =>
      `"${e.id}","${e.facility}","${e.verifiedOn}","${e.impacts.map((i) => `${i.value} ${i.kind}`).join("; ")}","VERIFIED"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `aetherguard-esg-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 2500);
  };

  const handleCycleComplete = (results: {
    co2Added: number;
    costAdded: number;
    waterAdded: number;
    energyAdded: number;
  }) => {
    // 1. Increment dashboard metrics with realized savings
    setMetrics((prev) =>
      prev.map((m) => {
        if (m.id === "co2") {
          return { ...m, value: Number((m.value + results.co2Added).toFixed(1)), deltaPct: m.deltaPct + 1.2 };
        }
        if (m.id === "cost") {
          return { ...m, value: m.value + results.costAdded, deltaPct: m.deltaPct + 1.8 };
        }
        if (m.id === "water") {
          return { ...m, value: Number((m.value + results.waterAdded).toFixed(1)), deltaPct: m.deltaPct + 0.9 };
        }
        if (m.id === "energy") {
          return { ...m, value: Number((m.value + results.energyAdded).toFixed(1)), deltaPct: m.deltaPct + 1.5 };
        }
        return m;
      })
    );

    // 2. Prepend synchronized multi-agent reasoning steps to activity stream
    const runId = `run-${Math.floor(Math.random() * 900) + 100}`;
    const newItems: ActivityItem[] = [
      {
        id: `act-${Date.now()}-5`,
        agentId: "executor",
        kind: "execution",
        title: "BACnet VFD Frequency Modulation Dispatched",
        detail: `Closed-loop actuator dispatch completed across ${facility}. Equipment harmonics within IEEE 519 spec.`,
        at: Date.now(),
        runId,
        impact: { kind: "cost", value: results.costAdded },
      },
      {
        id: `act-${Date.now()}-4`,
        agentId: "safety",
        kind: "safety",
        title: "ASHRAE 55 Occupant Thermal Comfort Verified",
        detail: `Deterministic safety bounds evaluated by AEGIS-04. Predicted Mean Vote (PMV) within ±0.5 band.`,
        at: Date.now() - 500,
        runId,
      },
      {
        id: `act-${Date.now()}-3`,
        agentId: "optimizer",
        kind: "plan",
        title: "Peak Carbon Shaving Schedule Synthesized",
        detail: `Simulated 450 kW battery discharge & precooling window against ERCOT carbon intensity index.`,
        at: Date.now() - 1000,
        runId,
        impact: { kind: "co2", value: results.co2Added },
      },
      {
        id: `act-${Date.now()}-2`,
        agentId: "analyst",
        kind: "analysis",
        title: "BigQuery Anomaly Detection: Sub-04 Thermal Drift",
        detail: `Chronos-02 flagged +18.4% deviation from thermodynamic baseline. Confidence: 96.2%.`,
        at: Date.now() - 1500,
        runId,
      },
      {
        id: `act-${Date.now()}-1`,
        agentId: "orchestrator",
        kind: "plan",
        title: "Autonomous Fleet Consensus Cycle Initiated",
        detail: `Operator requested ad-hoc synthesis across ${facility}. Decomposing optimization goals across 5 Vertex AI agents.`,
        at: Date.now() - 2000,
        runId,
      },
    ];

    setActivities((prev) => [...newItems, ...prev]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Page Title & Controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1.25rem",
          paddingBottom: "0.25rem",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <h1
              style={{
                fontSize: "1.625rem",
                fontWeight: 800,
                color: "var(--text-1)",
                letterSpacing: "-0.025em",
                lineHeight: 1.2,
              }}
            >
              Command Center
            </h1>
            <span
              style={{
                fontSize: "0.6875rem",
                fontWeight: 700,
                color: "var(--teal)",
                backgroundColor: "rgba(45, 226, 230, 0.12)",
                border: "1px solid rgba(45, 226, 230, 0.3)",
                padding: "2px 8px",
                borderRadius: "9999px",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Live Telemetry
            </span>
          </div>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-3)", marginTop: "0.3rem", fontWeight: 500 }}>
            Autonomous Multi-Agent Orchestration · Active Facility: <span style={{ color: "var(--text-2)", fontWeight: 600 }}>{facility}</span>
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Button
            variant="secondary"
            size="sm"
            icon={exported ? <CheckCircle2 size={14} color="var(--emerald)" /> : <Download size={14} />}
            onClick={handleExportLedger}
          >
            {exported ? "Downloaded CSV" : "Export Ledger"}
          </Button>

          {/* Prominent Satisfying Agent Cycle Button */}
          <div style={{ position: "relative" }}>
            <Button
              variant="primary"
              size="md"
              icon={
                <RefreshCw
                  size={15}
                  strokeWidth={2.5}
                  style={{
                    color: "#060911",
                  }}
                />
              }
              onClick={() => setIsCycleModalOpen(true)}
              style={{
                padding: "0.55rem 1.15rem",
                fontSize: "0.875rem",
                fontWeight: 700,
                letterSpacing: "-0.01em",
              }}
            >
              Run Agent Cycle
            </Button>
          </div>
        </div>
      </div>

      {/* Problem Statement Alignment & Autonomous Architecture Banner */}
      <ProblemAlignmentCard />

      {/* 4 Impact Metric Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1rem",
        }}
      >
        {metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      {/* Real-time Telemetry Load Comparison */}
      <TelemetryChart series={MOCK_TELEMETRY_SERIES} />

      {/* Two Column Grid: Activity Stream + Approvals Queue */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: "1.25rem",
        }}
      >
        <ActivityFeed activities={activities} />
        <ApprovalsQueue initialActions={MOCK_PENDING_ACTIONS} />
      </div>

      {/* Interactive Multi-Agent Cycle Modal */}
      <AgentCycleModal
        isOpen={isCycleModalOpen}
        onClose={() => setIsCycleModalOpen(false)}
        onCycleComplete={handleCycleComplete}
      />
    </div>
  );
}
