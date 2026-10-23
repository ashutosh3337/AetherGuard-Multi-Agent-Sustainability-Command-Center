import React from "react";
import type { ImpactKind } from "@/lib/types/domain";
import { formatImpact, IMPACT_META } from "@/lib/format";

interface ImpactBadgeProps {
  kind: ImpactKind;
  value: number;
  signed?: boolean;
  size?: "sm" | "md";
}

export function ImpactBadge({ kind, value, signed = true, size = "md" }: ImpactBadgeProps) {
  const meta = IMPACT_META[kind];
  const Icon = meta.Icon;

  return (
    <span
      className="glass-pill"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size === "sm" ? "4px" : "6px",
        padding: size === "sm" ? "2px 8px" : "4px 10px",
        fontSize: size === "sm" ? "0.75rem" : "0.8125rem",
        fontWeight: 500,
        color: meta.color,
        border: `1px solid rgba(255, 255, 255, 0.08)`,
        backgroundColor: `rgba(18, 28, 45, 0.5)`,
      }}
    >
      <Icon size={size === "sm" ? 12 : 14} color={meta.color} />
      <span className="tabular-nums font-mono">{formatImpact(kind, value, { signed })}</span>
    </span>
  );
}
