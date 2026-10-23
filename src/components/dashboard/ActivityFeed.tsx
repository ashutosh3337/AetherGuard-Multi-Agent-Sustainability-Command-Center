"use client";

import React from "react";
import type { ActivityItem } from "@/lib/types/domain";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ImpactBadge } from "@/components/ui/ImpactBadge";
import { formatRelative } from "@/lib/format";
import { ShieldCheck, Sparkles, AlertTriangle, Play, Brain, Clock } from "lucide-react";
import { useCommandCenter } from "@/components/providers/CommandCenterContext";
import { MOCK_AGENTS } from "@/lib/mock-data";

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const { setSelectedEntity, setContextPanelOpen } = useCommandCenter();

  const getAgent = (agentId: string) => MOCK_AGENTS.find((a) => a.id === agentId);

  const getKindIcon = (kind: ActivityItem["kind"]) => {
    switch (kind) {
      case "safety":
        return <ShieldCheck size={14} color="var(--emerald)" />;
      case "plan":
        return <Sparkles size={14} color="var(--teal)" />;
      case "analysis":
        return <Brain size={14} color="var(--sky)" />;
      case "execution":
        return <Play size={14} color="var(--amber)" />;
      case "alert":
        return <AlertTriangle size={14} color="var(--coral)" />;
    }
  };

  return (
    <GlassPanel style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Clock size={16} color="var(--teal)" />
          <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--text-1)" }}>
            Agent Activity & Reasoning Stream
          </h3>
        </div>
        <span
          className="glass-pill"
          style={{ fontSize: "0.6875rem", color: "var(--teal)", padding: "2px 8px" }}
        >
          LIVE FEED
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
        {activities.map((act) => {
          const agent = getAgent(act.agentId);
          return (
            <div
              key={act.id}
              onClick={() => {
                if (agent) {
                  setSelectedEntity({ type: "agent", data: agent });
                  setContextPanelOpen(true);
                }
              }}
              style={{
                display: "flex",
                gap: "0.75rem",
                padding: "0.75rem",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--bg-glass)",
                border: "1px solid var(--border-subtle)",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(45, 226, 230, 0.06)";
                e.currentTarget.style.borderColor = "rgba(45, 226, 230, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--bg-glass)";
                e.currentTarget.style.borderColor = "var(--border-subtle)";
              }}
            >
              {/* Kind Icon Box */}
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border-subtle)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {getKindIcon(act.kind)}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--teal)" }}>
                      {agent?.codename ?? act.agentId}
                    </span>
                    <span style={{ fontSize: "0.6875rem", color: "var(--text-3)" }}>•</span>
                    <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-1)" }}>
                      {act.title}
                    </span>
                  </div>
                  <span className="tabular-nums" style={{ fontSize: "0.6875rem", color: "var(--text-3)", flexShrink: 0 }}>
                    {formatRelative(act.at, Date.now())}
                  </span>
                </div>

                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-2)",
                    marginTop: "0.25rem",
                    lineHeight: 1.4,
                  }}
                >
                  {act.detail}
                </p>

                {act.impact && (
                  <div style={{ marginTop: "0.5rem" }}>
                    <ImpactBadge kind={act.impact.kind} value={act.impact.value} size="sm" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </GlassPanel>
  );
}
