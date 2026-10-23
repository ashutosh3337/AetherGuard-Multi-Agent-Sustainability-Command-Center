"use client";

import React, { useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";
import { StatusDot } from "@/components/ui/StatusDot";
import { ImpactBadge } from "@/components/ui/ImpactBadge";
import { useCommandCenter } from "@/components/providers/CommandCenterContext";
import {
  X,
  Cpu,
  ShieldCheck,
  Terminal,
  Activity,
  Zap,
  Layers,
  Sparkles,
  ExternalLink,
  Database,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { formatNumber, CATEGORY_META, SEVERITY_META } from "@/lib/format";

export function ContextPanel() {
  const { selectedEntity, setSelectedEntity, contextPanelOpen, setContextPanelOpen } = useCommandCenter();
  const [authorizedInsightId, setAuthorizedInsightId] = useState<string | null>(null);

  if (!contextPanelOpen || !selectedEntity) {
    return null;
  }

  const handleClose = () => setContextPanelOpen(false);

  return (
    <aside
      className="glass-panel"
      style={{
        width: "360px",
        minWidth: "320px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
        overflowY: "auto",
        borderLeft: "1px solid var(--border-glass)",
        borderRadius: "0",
        padding: "1.25rem",
        zIndex: 20,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Layers size={16} color="var(--teal)" />
          <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Contextual Inspector
          </span>
        </div>
        <button
          onClick={handleClose}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text-3)",
            cursor: "pointer",
            padding: "4px",
            display: "flex",
          }}
          title="Close panel"
        >
          <X size={16} />
        </button>
      </div>

      {/* Render based on entity type */}
      {selectedEntity.type === "agent" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Agent Header */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span className="font-mono" style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--teal)" }}>
                {selectedEntity.data.codename}
              </span>
              <span
                className="glass-pill"
                style={{ fontSize: "0.6875rem", color: "var(--text-3)", padding: "1px 6px" }}
              >
                {selectedEntity.data.model}
              </span>
            </div>
            <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--text-1)", marginTop: "0.25rem" }}>
              {selectedEntity.data.name}
            </h2>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-3)", marginTop: "0.25rem", lineHeight: 1.4 }}>
              {selectedEntity.data.role}
            </p>
          </div>

          {/* Status Box */}
          <div
            style={{
              padding: "0.75rem",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--bg-glass)",
              border: "1px solid var(--border-subtle)",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>Operational State</span>
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <StatusDot status={selectedEntity.data.status} size="sm" />
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    color: selectedEntity.data.status === "active" ? "var(--emerald)" : "var(--teal)",
                  }}
                >
                  {selectedEntity.data.status}
                </span>
              </div>
            </div>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-2)", lineHeight: 1.4 }}>
              {selectedEntity.data.currentTask}
            </p>
          </div>

          {/* Authorized Tools */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
              <Terminal size={14} color="var(--teal)" />
              <h4 style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Registered Agent Tools
              </h4>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              {selectedEntity.data.tools.map((tool, idx) => (
                <div
                  key={idx}
                  className="font-mono"
                  style={{
                    padding: "0.4rem 0.65rem",
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: "var(--bg-surface)",
                    border: "1px solid var(--border-subtle)",
                    fontSize: "0.75rem",
                    color: "var(--teal)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <span style={{ color: "var(--text-3)" }}>$</span>
                  {tool}()
                </div>
              ))}
            </div>
          </div>

          {/* Telemetry Metrics */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
              <Activity size={14} color="var(--emerald)" />
              <h4 style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Agent Performance Metrics
              </h4>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.5rem",
              }}
            >
              <div style={{ padding: "0.65rem", borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-glass)", border: "1px solid var(--border-subtle)" }}>
                <span style={{ fontSize: "0.6875rem", color: "var(--text-3)", display: "block" }}>Avg Latency</span>
                <span className="tabular-nums font-mono" style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-1)" }}>
                  {selectedEntity.data.stats.avgLatencyMs} ms
                </span>
              </div>
              <div style={{ padding: "0.65rem", borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-glass)", border: "1px solid var(--border-subtle)" }}>
                <span style={{ fontSize: "0.6875rem", color: "var(--text-3)", display: "block" }}>Success Rate</span>
                <span className="tabular-nums font-mono" style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--emerald)" }}>
                  {selectedEntity.data.stats.successRate}%
                </span>
              </div>
              <div style={{ padding: "0.65rem", borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-glass)", border: "1px solid var(--border-subtle)" }}>
                <span style={{ fontSize: "0.6875rem", color: "var(--text-3)", display: "block" }}>24h Reasoning Runs</span>
                <span className="tabular-nums font-mono" style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-1)" }}>
                  {selectedEntity.data.stats.runs24h}
                </span>
              </div>
              <div style={{ padding: "0.65rem", borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-glass)", border: "1px solid var(--border-subtle)" }}>
                <span style={{ fontSize: "0.6875rem", color: "var(--text-3)", display: "block" }}>Tokens Consumed</span>
                <span className="tabular-nums font-mono" style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-1)" }}>
                  {formatNumber(selectedEntity.data.stats.tokens24h)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedEntity.type === "action" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <span
              style={{
                fontSize: "0.6875rem",
                fontWeight: 600,
                textTransform: "uppercase",
                padding: "2px 6px",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "rgba(251, 191, 36, 0.15)",
                color: "var(--amber)",
              }}
            >
              {selectedEntity.data.risk} RISK INTERVENTION
            </span>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--text-1)", marginTop: "0.35rem" }}>
              {selectedEntity.data.title}
            </h3>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-3)", marginTop: "0.2rem" }}>
              Target Facility: {selectedEntity.data.facility}
            </p>
          </div>

          <div
            style={{
              padding: "0.75rem",
              borderRadius: "var(--radius-md)",
              backgroundColor: "rgba(52, 211, 153, 0.05)",
              border: "1px solid rgba(52, 211, 153, 0.2)",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <ShieldCheck size={18} color="var(--emerald)" />
            <div style={{ fontSize: "0.75rem" }}>
              <strong style={{ color: "var(--emerald)" }}>Safety Review: PASSED</strong>
              <p style={{ color: "var(--text-2)", marginTop: "1px" }}>
                Verified against ASHRAE 55 and IEEE 519 harmonics standard.
              </p>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-2)", marginBottom: "0.5rem" }}>
              Projected 24h Impact
            </h4>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {selectedEntity.data.projected.map((imp, idx) => (
                <ImpactBadge key={idx} kind={imp.kind} value={imp.value} />
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedEntity.type === "insight" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}>
              <span
                style={{
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  padding: "2px 7px",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: `${CATEGORY_META[selectedEntity.data.category].color}1a`,
                  color: CATEGORY_META[selectedEntity.data.category].color,
                  border: `1px solid ${CATEGORY_META[selectedEntity.data.category].color}35`,
                }}
              >
                {CATEGORY_META[selectedEntity.data.category].label}
              </span>
              <span
                style={{
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  padding: "2px 7px",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: `${SEVERITY_META[selectedEntity.data.severity].color}1a`,
                  color: SEVERITY_META[selectedEntity.data.severity].color,
                  border: `1px solid ${SEVERITY_META[selectedEntity.data.severity].color}35`,
                }}
              >
                {SEVERITY_META[selectedEntity.data.severity].label} Priority
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-3)", display: "flex", alignItems: "center", gap: "3px" }}>
                <Building2 size={12} /> {selectedEntity.data.facility}
              </span>
            </div>

            <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--text-1)", marginTop: "0.45rem", lineHeight: 1.3 }}>
              {selectedEntity.data.title}
            </h3>
            <p style={{ fontSize: "0.75rem", color: "var(--text-3)", marginTop: "0.25rem" }}>
              Discovered by: <strong style={{ color: "var(--teal)" }}>{selectedEntity.data.agentId.toUpperCase()}</strong>
            </p>
          </div>

          {/* AI Confidence Meter */}
          <div
            style={{
              padding: "0.75rem",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--bg-glass)",
              border: "1px solid var(--border-subtle)",
              display: "flex",
              flexDirection: "column",
              gap: "0.35rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
              <span style={{ color: "var(--text-3)" }}>Statistical Confidence</span>
              <span className="font-mono tabular-nums" style={{ color: "var(--teal)", fontWeight: 700 }}>
                {Math.round(selectedEntity.data.confidence * 100)}%
              </span>
            </div>
            <div
              style={{
                width: "100%",
                height: "6px",
                borderRadius: "9999px",
                backgroundColor: "var(--bg-surface)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${Math.round(selectedEntity.data.confidence * 100)}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, var(--teal), var(--emerald))",
                  borderRadius: "9999px",
                }}
              />
            </div>
          </div>

          {/* Summary */}
          <div>
            <h4 style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.35rem" }}>
              Anomaly Diagnostics
            </h4>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-2)", lineHeight: 1.5 }}>
              {selectedEntity.data.summary}
            </p>
          </div>

          {/* BigQuery Partition Query Snippet */}
          <div
            style={{
              padding: "0.75rem",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              fontSize: "0.75rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.4rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--teal)" }}>
              <Database size={13} />
              <span style={{ fontWeight: 600, letterSpacing: "0.02em" }}>BigQuery Partition Query</span>
            </div>
            <code
              className="font-mono"
              style={{
                fontSize: "0.6875rem",
                color: "var(--text-2)",
                lineHeight: 1.4,
                wordBreak: "break-all",
                display: "block",
              }}
            >
              SELECT timestamp, variance_pct FROM telemetry.partitioned_sensory WHERE facility = &apos;{selectedEntity.data.facility}&apos; AND anomaly_score &gt; 0.82
            </code>
          </div>

          {/* Projected Impact */}
          <div>
            <h4 style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-2)", marginBottom: "0.5rem" }}>
              Projected Mitigation Yield
            </h4>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              {selectedEntity.data.projected.map((imp, idx) => (
                <ImpactBadge key={idx} kind={imp.kind} value={imp.value} />
              ))}
            </div>
          </div>

          {/* Mitigation Authorization Button */}
          <div>
            {authorizedInsightId === selectedEntity.data.id ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "rgba(52, 211, 153, 0.12)",
                  border: "1px solid rgba(52, 211, 153, 0.35)",
                  color: "var(--emerald)",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                }}
              >
                <CheckCircle2 size={16} />
                <span>Intervention Dispatched to Actuator Gateway</span>
              </div>
            ) : (
              <Button
                variant="primary"
                size="md"
                icon={<Sparkles size={14} />}
                onClick={() => setAuthorizedInsightId(selectedEntity.data.id)}
                style={{ width: "100%" }}
              >
                Authorize Mitigation Plan
              </Button>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
