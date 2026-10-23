"use client";

import React, { useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ImpactBadge } from "@/components/ui/ImpactBadge";
import { Button } from "@/components/ui/Button";
import { MOCK_INSIGHTS } from "@/lib/mock-data";
import { LineChart, Sparkles, AlertTriangle, ArrowUpRight, Filter, Building2 } from "lucide-react";
import { useCommandCenter } from "@/components/providers/CommandCenterContext";
import { CATEGORY_META, SEVERITY_META } from "@/lib/format";
import type { ResourceCategory } from "@/lib/types/domain";

export default function InsightsPage() {
  const [filter, setFilter] = useState<ResourceCategory | "all">("all");
  const { setSelectedEntity, setContextPanelOpen } = useCommandCenter();

  const filtered = filter === "all" ? MOCK_INSIGHTS : MOCK_INSIGHTS.filter((i) => i.category === filter);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-1)", letterSpacing: "-0.02em" }}>
            Environmental Intelligence & Anomalies
          </h1>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-3)", marginTop: "0.2rem" }}>
            Autonomous BigQuery telemetry analysis · Baseline variance & AI optimization recommendations
          </p>
        </div>

        {/* Category Filters */}
        <div style={{ display: "flex", gap: "0.35rem" }}>
          {(["all", "energy", "water", "carbon", "waste"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className="glass-pill"
              style={{
                padding: "0.3rem 0.75rem",
                fontSize: "0.75rem",
                fontWeight: 600,
                textTransform: "capitalize",
                color: filter === cat ? "var(--teal)" : "var(--text-2)",
                border: filter === cat ? "1px solid var(--teal)" : "1px solid var(--border-subtle)",
                background: filter === cat ? "rgba(45, 226, 230, 0.15)" : "var(--bg-glass)",
                cursor: "pointer",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Insights List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {filtered.map((insight) => {
          const catMeta = CATEGORY_META[insight.category];
          const sevMeta = SEVERITY_META[insight.severity];

          return (
            <GlassPanel
              key={insight.id}
              interactive
              onClick={() => {
                setSelectedEntity({ type: "insight", data: insight });
                setContextPanelOpen(true);
              }}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.85rem",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span
                      style={{
                        fontSize: "0.6875rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        padding: "2px 7px",
                        borderRadius: "var(--radius-sm)",
                        backgroundColor: `${catMeta.color}1a`,
                        color: catMeta.color,
                        border: `1px solid ${catMeta.color}35`,
                      }}
                    >
                      {catMeta.label}
                    </span>
                    <span
                      style={{
                        fontSize: "0.6875rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        padding: "2px 7px",
                        borderRadius: "var(--radius-sm)",
                        backgroundColor: `${sevMeta.color}1a`,
                        color: sevMeta.color,
                        border: `1px solid ${sevMeta.color}35`,
                      }}
                    >
                      {sevMeta.label} Priority
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-3)", display: "flex", alignItems: "center", gap: "3px" }}>
                      <Building2 size={12} /> {insight.facility}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "1.0625rem", fontWeight: 700, color: "var(--text-1)", marginTop: "0.35rem" }}>
                    {insight.title}
                  </h3>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span className="tabular-nums font-mono" style={{ fontSize: "0.75rem", color: "var(--teal)" }}>
                    Confidence: {Math.round(insight.confidence * 100)}%
                  </span>
                  <ArrowUpRight size={16} color="var(--text-3)" />
                </div>
              </div>

              <p style={{ fontSize: "0.8125rem", color: "var(--text-2)", lineHeight: 1.5 }}>
                {insight.summary}
              </p>

              {/* Projected Gains & Agent Attribution */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  paddingTop: "0.65rem",
                  borderTop: "1px solid var(--border-subtle)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>Projected Benefit:</span>
                  {insight.projected.map((imp, idx) => (
                    <ImpactBadge key={idx} kind={imp.kind} value={imp.value} size="sm" />
                  ))}
                </div>

                <span style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>
                  Discovered by: <strong style={{ color: "var(--teal)" }}>{insight.agentId.toUpperCase()}</strong>
                </span>
              </div>
            </GlassPanel>
          );
        })}
      </div>
    </div>
  );
}
