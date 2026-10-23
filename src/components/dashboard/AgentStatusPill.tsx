"use client";

import React from "react";
import type { Agent } from "@/lib/types/domain";
import { StatusDot } from "@/components/ui/StatusDot";
import { useCommandCenter } from "@/components/providers/CommandCenterContext";

interface AgentStatusPillProps {
  agent: Agent;
}

export function AgentStatusPill({ agent }: AgentStatusPillProps) {
  const { selectedEntity, setSelectedEntity, setContextPanelOpen } = useCommandCenter();
  const isSelected = selectedEntity?.type === "agent" && selectedEntity.data.id === agent.id;

  const handleClick = () => {
    setSelectedEntity({ type: "agent", data: agent });
    setContextPanelOpen(true);
  };

  return (
    <button
      onClick={handleClick}
      className="glass-pill"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.25rem 0.65rem",
        background: isSelected ? "rgba(45, 226, 230, 0.15)" : "var(--bg-glass)",
        border: isSelected ? "1px solid var(--teal)" : "1px solid var(--border-subtle)",
        cursor: "pointer",
        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      title={`${agent.name} (${agent.model}): ${agent.status} - ${agent.currentTask}`}
    >
      <StatusDot status={agent.status} size="sm" />
      <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-1)" }}>
        {agent.codename.split("-")[0]}
      </span>
      <span
        style={{
          fontSize: "0.6875rem",
          color: "var(--text-3)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {agent.status}
      </span>
    </button>
  );
}
