import React from "react";

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
  glow?: "teal" | "emerald" | "amber" | "none";
  className?: string;
}

export function GlassPanel({
  children,
  interactive = false,
  glow = "none",
  className = "",
  style,
  ...props
}: GlassPanelProps) {
  let glowStyle = "";
  if (glow === "teal") glowStyle = "glow-teal";
  if (glow === "emerald") glowStyle = "glow-emerald";

  return (
    <div
      className={`glass-panel ${interactive ? "glass-panel-interactive" : ""} ${glowStyle} ${className}`}
      style={{
        padding: "1.25rem",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
