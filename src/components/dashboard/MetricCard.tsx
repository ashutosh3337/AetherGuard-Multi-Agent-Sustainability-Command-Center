import React from "react";
import type { Metric } from "@/lib/types/domain";
import { formatNumber, IMPACT_META } from "@/lib/format";
import { toPoints, smoothPath } from "@/lib/chart";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { TrendingUp } from "lucide-react";

interface MetricCardProps {
  metric: Metric;
}

export function MetricCard({ metric }: MetricCardProps) {
  const meta = IMPACT_META[metric.id];
  const Icon = meta.Icon;

  // Generate sparkline path
  const width = 110;
  const height = 32;
  const pts = toPoints(metric.trend, width, height, { pad: 3 });
  const sparklineD = smoothPath(pts);

  // Closed area path for gradient
  const firstPt = pts[0] ?? { x: 0, y: height };
  const lastPt = pts[pts.length - 1] ?? { x: width, y: height };
  const areaD = `${sparklineD} L ${lastPt.x} ${height} L ${firstPt.x} ${height} Z`;

  const gradientId = `grad-${metric.id}`;

  return (
    <GlassPanel
      interactive
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.85rem",
        padding: "1.25rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px",
              borderRadius: "var(--radius-sm)",
              backgroundColor: `${meta.color}1f`,
              color: meta.color,
              border: `1px solid ${meta.color}33`,
            }}
          >
            <Icon size={17} />
          </span>
          <span style={{ fontSize: "0.8125rem", color: "var(--text-2)", fontWeight: 600, letterSpacing: "0.01em" }}>
            {metric.label}
          </span>
        </div>

        {/* Delta Badge */}
        <span
          className="tabular-nums font-mono"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "3px",
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "var(--emerald)",
            backgroundColor: "rgba(52, 211, 153, 0.12)",
            border: "1px solid rgba(52, 211, 153, 0.25)",
            padding: "2px 7px",
            borderRadius: "9999px",
          }}
        >
          <TrendingUp size={12} strokeWidth={2.5} />
          +{metric.deltaPct}%
        </span>
      </div>

      {/* Main Metric Value */}
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.35rem", marginTop: "0.15rem" }}>
        {meta.prefix && (
          <span style={{ fontSize: "1.25rem", color: "var(--text-3)", fontWeight: 600 }}>
            {meta.prefix}
          </span>
        )}
        <span
          className="tabular-nums font-mono"
          style={{
            fontSize: "1.875rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "var(--text-1)",
            lineHeight: 1.1,
          }}
        >
          {formatNumber(metric.value, meta.decimals)}
        </span>
        {meta.unit && (
          <span style={{ fontSize: "0.875rem", color: "var(--text-3)", fontWeight: 600, marginLeft: "0.1rem" }}>
            {meta.unit}
          </span>
        )}
      </div>

      {/* Sparkline & Caption */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: "0.35rem" }}>
        <span style={{ fontSize: "0.75rem", color: "var(--text-3)", fontWeight: 500 }}>{metric.caption}</span>

        {/* SVG Sparkline with subtle area gradient */}
        <svg width={width} height={height} style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={meta.color} stopOpacity="0.28" />
              <stop offset="100%" stopColor={meta.color} stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path d={areaD} fill={`url(#${gradientId})`} />
          <path
            d={sparklineD}
            fill="none"
            stroke={meta.color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </GlassPanel>
  );
}
