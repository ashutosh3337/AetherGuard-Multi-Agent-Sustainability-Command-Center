"use client";

import React, { useState } from "react";
import type { TelemetrySeries } from "@/lib/types/domain";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { toPoints, smoothPath, areaPath, bandPath } from "@/lib/chart";
import { Zap, Activity, Info } from "lucide-react";

interface TelemetryChartProps {
  series: TelemetrySeries;
}

export function TelemetryChart({ series }: TelemetryChartProps) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const width = 640;
  const height = 220;
  const pad = 20;

  const allVals = [...series.baseline, ...series.actual];
  const minVal = Math.min(...allVals) * 0.85;
  const maxVal = Math.max(...allVals) * 1.05;

  const baselinePts = toPoints(series.baseline, width, height, { pad, min: minVal, max: maxVal });
  const actualPts = toPoints(series.actual, width, height, { pad, min: minVal, max: maxVal });

  const baselineD = smoothPath(baselinePts);
  const actualD = smoothPath(actualPts);
  const actualAreaD = areaPath(actualPts, height - pad);
  const savedBandD = bandPath(baselinePts, actualPts);

  return (
    <GlassPanel style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Header with Title & Legend */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Zap size={16} color="var(--amber)" />
            <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--text-1)" }}>
              Energy Load Optimization (Baseline vs. Active Actuation)
            </h3>
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--text-3)", marginTop: "0.2rem" }}>
            Real-time sensor feed across Campus Alpha & Plant Beta · Unit: {series.unit}
          </p>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <span style={{ width: "12px", height: "2px", backgroundColor: "var(--text-3)", display: "inline-block" }} />
            <span style={{ color: "var(--text-3)" }}>Unmanaged Baseline</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <span style={{ width: "12px", height: "2px", backgroundColor: "var(--teal)", display: "inline-block" }} />
            <span style={{ color: "var(--teal)", fontWeight: 600 }}>AetherGuard Managed</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "2px",
                backgroundColor: "rgba(52, 211, 153, 0.25)",
                display: "inline-block",
              }}
            />
            <span style={{ color: "var(--emerald)" }}>Avoided Waste</span>
          </div>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div style={{ width: "100%", overflowX: "auto" }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: "100%", height: "auto", minHeight: "180px", overflow: "visible" }}
        >
          <defs>
            <linearGradient id="actualAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2de2e6" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#2de2e6" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="savedBandGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((pct, idx) => {
            const y = pad + (height - pad * 2) * pct;
            return (
              <line
                key={idx}
                x1={0}
                y1={y}
                x2={width}
                y2={y}
                stroke="var(--border-subtle)"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Shaded band between baseline and actual */}
          <path d={savedBandD} fill="url(#savedBandGrad)" />

          {/* Actual area fill */}
          <path d={actualAreaD} fill="url(#actualAreaGrad)" />

          {/* Baseline path (dashed) */}
          <path
            d={baselineD}
            fill="none"
            stroke="var(--text-3)"
            strokeWidth="1.75"
            strokeDasharray="5 5"
            opacity="0.7"
          />

          {/* Actual line (solid teal) */}
          <path
            d={actualD}
            fill="none"
            stroke="var(--teal)"
            strokeWidth="2.25"
            strokeLinecap="round"
          />

          {/* Points on Actual */}
          {actualPts.map((p, idx) => (
            <circle
              key={idx}
              cx={p.x}
              cy={p.y}
              r={hoverIdx === idx ? 5 : 3}
              fill="var(--bg-base)"
              stroke="var(--teal)"
              strokeWidth="2"
              style={{ transition: "r 0.15s ease" }}
            />
          ))}

          {/* X Axis Time Labels */}
          {series.labels.map((lbl, idx) => {
            const x = (width / (series.labels.length - 1)) * idx;
            return (
              <text
                key={idx}
                x={x}
                y={height - 2}
                textAnchor={idx === 0 ? "start" : idx === series.labels.length - 1 ? "end" : "middle"}
                fill="var(--text-3)"
                fontSize="10"
                fontFamily="inherit"
              >
                {lbl}
              </text>
            );
          })}
        </svg>
      </div>
    </GlassPanel>
  );
}
