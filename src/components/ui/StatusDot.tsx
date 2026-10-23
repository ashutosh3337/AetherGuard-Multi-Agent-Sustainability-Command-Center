import React from "react";
import type { AgentStatus } from "@/lib/types/domain";

interface StatusDotProps {
  status: AgentStatus | "nominal" | "degraded" | "critical" | "online" | "offline";
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
}

export function StatusDot({ status, size = "md", pulse = true }: StatusDotProps) {
  let color = "var(--text-3)";
  let isPulsing = pulse;

  if (status === "active" || status === "nominal" || status === "online") {
    color = "var(--emerald)";
  } else if (status === "thinking") {
    color = "var(--teal)";
    isPulsing = true;
  } else if (status === "idle") {
    color = "var(--text-3)";
    isPulsing = false;
  } else if (status === "degraded") {
    color = "var(--amber)";
  } else if (status === "critical" || status === "offline") {
    color = "var(--coral)";
  }

  const pxSize = size === "sm" ? 6 : size === "lg" ? 12 : 8;

  return (
    <span
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: pxSize + 4,
        height: pxSize + 4,
      }}
    >
      {isPulsing && (
        <span
          className="animate-pulse-subtle"
          style={{
            position: "absolute",
            width: pxSize * 2,
            height: pxSize * 2,
            borderRadius: "50%",
            backgroundColor: color,
            opacity: 0.25,
          }}
        />
      )}
      <span
        style={{
          width: pxSize,
          height: pxSize,
          borderRadius: "50%",
          backgroundColor: color,
          boxShadow: `0 0 8px ${color}`,
        }}
      />
    </span>
  );
}
