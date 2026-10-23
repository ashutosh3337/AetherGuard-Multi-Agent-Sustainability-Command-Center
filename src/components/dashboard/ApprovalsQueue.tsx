"use client";

import React, { useState } from "react";
import type { PendingAction } from "@/lib/types/domain";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";
import { ImpactBadge } from "@/components/ui/ImpactBadge";
import { ShieldAlert, Check, X, Building2, AlertCircle } from "lucide-react";
import { useCommandCenter } from "@/components/providers/CommandCenterContext";

interface ApprovalsQueueProps {
  initialActions: PendingAction[];
}

export function ApprovalsQueue({ initialActions }: ApprovalsQueueProps) {
  const [actions, setActions] = useState<PendingAction[]>(initialActions);
  const [actingId, setActingId] = useState<string | null>(null);
  const { setSelectedEntity, setContextPanelOpen } = useCommandCenter();

  const handleApprove = (action: PendingAction) => {
    setActingId(action.id);
    setTimeout(() => {
      setActions((prev) => prev.filter((a) => a.id !== action.id));
      setActingId(null);
    }, 400);
  };

  const handleReject = (action: PendingAction) => {
    setActingId(action.id);
    setTimeout(() => {
      setActions((prev) => prev.filter((a) => a.id !== action.id));
      setActingId(null);
    }, 400);
  };

  return (
    <GlassPanel style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <ShieldAlert size={16} color="var(--amber)" />
          <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--text-1)" }}>
            Pending Intervention Approvals ({actions.length})
          </h3>
        </div>
        <span style={{ fontSize: "0.6875rem", color: "var(--text-3)" }}>
          Human-in-the-Loop Safety Gate
        </span>
      </div>

      {actions.length === 0 ? (
        <div
          style={{
            padding: "1.5rem",
            textAlign: "center",
            color: "var(--text-3)",
            fontSize: "0.8125rem",
            border: "1px dashed var(--border-subtle)",
            borderRadius: "var(--radius-md)",
          }}
        >
          All autonomous recommendations cleared. No pending operator actions.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {actions.map((act) => (
            <div
              key={act.id}
              onClick={() => {
                setSelectedEntity({ type: "action", data: act });
                setContextPanelOpen(true);
              }}
              style={{
                padding: "0.85rem",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--bg-glass)",
                border: "1px solid var(--border-subtle)",
                display: "flex",
                flexDirection: "column",
                gap: "0.65rem",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(251, 191, 36, 0.4)";
                e.currentTarget.style.backgroundColor = "rgba(251, 191, 36, 0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-subtle)";
                e.currentTarget.style.backgroundColor = "var(--bg-glass)";
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span
                      style={{
                        fontSize: "0.6875rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        padding: "1px 5px",
                        borderRadius: "var(--radius-sm)",
                        backgroundColor:
                          act.risk === "high"
                            ? "rgba(248, 113, 113, 0.15)"
                            : "rgba(251, 191, 36, 0.15)",
                        color: act.risk === "high" ? "var(--coral)" : "var(--amber)",
                      }}
                    >
                      {act.risk} RISK
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-3)", display: "flex", alignItems: "center", gap: "3px" }}>
                      <Building2 size={12} /> {act.facility}
                    </span>
                  </div>
                  <h4 style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-1)", marginTop: "0.25rem" }}>
                    {act.title}
                  </h4>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }} onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<Check size={13} />}
                    loading={actingId === act.id}
                    onClick={() => handleApprove(act)}
                    title="Approve & Dispatch Actuators"
                  >
                    Approve
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<X size={13} />}
                    disabled={actingId === act.id}
                    onClick={() => handleReject(act)}
                    title="Reject"
                  />
                </div>
              </div>

              {/* Projected Impact Pills */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}>
                {act.projected.map((imp, idx) => (
                  <ImpactBadge key={idx} kind={imp.kind} value={imp.value} size="sm" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassPanel>
  );
}
