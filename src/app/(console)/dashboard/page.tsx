"use client";

import React, { useState } from "react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { TelemetryChart } from "@/components/dashboard/TelemetryChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { ApprovalsQueue } from "@/components/dashboard/ApprovalsQueue";
import { Button } from "@/components/ui/Button";
import {
  MOCK_METRICS,
  MOCK_TELEMETRY_SERIES,
  MOCK_ACTIVITY,
  MOCK_PENDING_ACTIONS,
  MOCK_LEDGER_ENTRIES,
} from "@/lib/mock-data";
import { Play, Download, Sparkles, RefreshCw, CheckCircle2 } from "lucide-react";
import { useCommandCenter } from "@/components/providers/CommandCenterContext";

export default function DashboardPage() {
  const { facility } = useCommandCenter();
  const [triggering, setTriggering] = useState(false);
  const [exported, setExported] = useState(false);
  const [activities, setActivities] = useState(MOCK_ACTIVITY);

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

  const handleTriggerCycle = () => {
    setTriggering(true);
    setTimeout(() => {
      const newActivity = {
        id: `act-${Date.now()}`,
        agentId: "orchestrator" as const,
        kind: "plan" as const,
        title: "Manual Orchestrator Reasoning Cycle Initiated",
        detail: `Operator dispatched ad-hoc synthesis across ${facility}. Querying BigQuery telemetry partitions.`,
        at: Date.now(),
        runId: `run-${Math.floor(Math.random() * 900) + 100}`,
      };
      setActivities([newActivity, ...activities]);
      setTriggering(false);
    }, 800);
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
                    animation: triggering ? "spin 0.8s linear infinite" : "none",
                    color: "#060911",
                  }}
                />
              }
              loading={triggering}
              onClick={handleTriggerCycle}
              style={{
                padding: "0.55rem 1.15rem",
                fontSize: "0.875rem",
                fontWeight: 700,
                letterSpacing: "-0.01em",
              }}
            >
              {triggering ? "Synthesizing Cycle..." : "Run Agent Cycle"}
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Impact Metric Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1rem",
        }}
      >
        {MOCK_METRICS.map((metric) => (
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
    </div>
  );
}
