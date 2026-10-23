"use client";

import React from "react";
import type { Agent } from "@/lib/types/domain";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { StatusDot } from "@/components/ui/StatusDot";
import { formatNumber } from "@/lib/format";
import { Cpu, Zap, Activity, CheckCircle2 } from "lucide-react";
import { useCommandCenter } from "@/components/providers/CommandCenterContext";

interface AgentStatusCardProps {
  agent: Agent;
}

export function AgentStatusCard({ agent }: AgentStatusCardProps) {
  const { selectedEntity, setSelectedEntity, setContextPanelOpen } = useCommandCenter();
  const isSelected = selectedEntity?.type === "agent" && selectedEntity.data.id === agent.id;

  const handleClick = () => {
    setSelectedEntity({ type: "agent", data: agent });
    setContextPanelOpen(true);
  };

  return (
    <GlassPanel
      interactive
      glow={isSelected ? "teal" : "none"}
      onClick={handleClick}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        cursor: "pointer",
        border: isSelected ? "1px solid var(--teal)" : undefined,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
              className="font-mono"
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "var(--teal)",
                letterSpacing: "0.05em",
              }}
            >
              {agent.codename}
            </span>
            <span
              style={{
                fontSize: "0.6875rem",
                color: "var(--text-3)",
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                padding: "1px 6px",
                borderRadius: "var(--radius-sm)",
                fontWeight: 500,
              }}
            >
              {agent.model}
            </span>
          </div>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-1)", marginTop: "0.25rem" }}>
            {agent.name}
          </h3>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-3)", marginTop: "0.15rem" }}>
            {agent.role}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <StatusDot status={agent.status} />
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: agent.status === "active" ? "var(--emerald)" : agent.status === "thinking" ? "var(--teal)" : "var(--text-3)",
            }}
          >
            {agent.status}
          </span>
        </div>
      </div>

      {/* Current Task Box */}
      <div
        style={{
          padding: "0.65rem 0.85rem",
          borderRadius: "var(--radius-md)",
          backgroundColor: "var(--bg-glass)",
          border: "1px solid var(--border-subtle)",
          fontSize: "0.8125rem",
          color: "var(--text-2)",
          display: "flex",
          gap: "0.5rem",
          alignItems: "flex-start",
        }}
      >
        <Activity size={15} color="var(--teal)" style={{ flexShrink: 0, marginTop: "2px" }} />
        <span>{agent.currentTask}</span>
      </div>

      {/* Performance Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "0.5rem",
          marginTop: "auto",
          paddingTop: "0.5rem",
          borderTop: "1px solid var(--border-subtle)",
        }}
      >
        <div>
          <span style={{ fontSize: "0.6875rem", color: "var(--text-3)", display: "block" }}>Latency</span>
          <span className="tabular-nums font-mono" style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-1)" }}>
            {agent.stats.avgLatencyMs}ms
          </span>
        </div>
        <div>
          <span style={{ fontSize: "0.6875rem", color: "var(--text-3)", display: "block" }}>Success</span>
          <span className="tabular-nums font-mono" style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--emerald)" }}>
            {agent.stats.successRate}%
          </span>
        </div>
        <div>
          <span style={{ fontSize: "0.6875rem", color: "var(--text-3)", display: "block" }}>24h Runs</span>
          <span className="tabular-nums font-mono" style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-1)" }}>
            {formatNumber(agent.stats.runs24h)}
          </span>
        </div>
      </div>
    </GlassPanel>
  );
}
