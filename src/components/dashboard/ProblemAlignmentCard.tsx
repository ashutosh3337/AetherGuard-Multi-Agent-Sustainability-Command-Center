"use client";

import React, { useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import {
  ShieldAlert,
  Bot,
  Flame,
  Zap,
  Droplets,
  Coins,
  ChevronDown,
  ChevronUp,
  Cpu,
  Database,
  Lock,
  Sparkles,
} from "lucide-react";

export function ProblemAlignmentCard() {
  const [expanded, setExpanded] = useState(false);

  return (
    <GlassPanel
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.85rem",
        border: "1px solid rgba(45, 226, 230, 0.25)",
        background: "linear-gradient(135deg, rgba(45, 226, 230, 0.05) 0%, rgba(52, 211, 153, 0.03) 100%)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "var(--radius-sm)",
              backgroundColor: "rgba(45, 226, 230, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Bot size={16} color="var(--teal)" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-1)" }}>
                Autonomous Sustainability Architecture & Problem Statement
              </span>
              <span
                style={{
                  fontSize: "0.625rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "var(--emerald)",
                  backgroundColor: "rgba(52, 211, 153, 0.15)",
                  padding: "1px 6px",
                  borderRadius: "var(--radius-sm)",
                  letterSpacing: "0.05em",
                }}
              >
                Vertex AI Fleet
              </span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--text-3)", marginTop: "2px" }}>
              Solving the 38% industrial building energy waste through closed-loop Multi-Agent intelligence
            </p>
          </div>
        </div>

        <button
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text-3)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        >
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {expanded && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1rem",
            paddingTop: "0.75rem",
            borderTop: "1px solid var(--border-subtle)",
            animation: "fadeIn 0.2s ease-in-out",
          }}
        >
          {/* Card 1: The Problem */}
          <div
            style={{
              padding: "0.85rem",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--bg-glass)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--coral)", marginBottom: "0.35rem" }}>
              <Flame size={14} />
              <strong style={{ fontSize: "0.8125rem" }}>The Real-World Problem</strong>
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--text-2)", lineHeight: 1.45 }}>
              Enterprise data centers & industrial facilities waste billions of kWh and thousands of avoidable metric tons of CO₂ annually due to rigid, uncoordinated legacy Building Management Systems (BMS). Static setpoints fail to adapt to dynamic grid carbon intensity spikes.
            </p>
          </div>

          {/* Card 2: Multi-Agent Solution */}
          <div
            style={{
              padding: "0.85rem",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--bg-glass)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--teal)", marginBottom: "0.35rem" }}>
              <Sparkles size={14} />
              <strong style={{ fontSize: "0.8125rem" }}>Autonomous Agent Loop</strong>
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--text-2)", lineHeight: 1.45 }}>
              5 specialized agents coordinate via a <strong>Supervised Blackboard State Bus</strong>. ATLAS-01 (Orchestrator) queries BigQuery partitions, PROMETHEUS-03 synthesizes precooling shifts, and HERMES-05 dispatches physical BACnet/Modbus commands without human bottleneck.
            </p>
          </div>

          {/* Card 3: Safety Guardrail */}
          <div
            style={{
              padding: "0.85rem",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--bg-glass)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--emerald)", marginBottom: "0.35rem" }}>
              <Lock size={14} />
              <strong style={{ fontSize: "0.8125rem" }}>Deterministic Safety Gate</strong>
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--text-2)", lineHeight: 1.45 }}>
              AEGIS-04 evaluates every proposed intervention against hard physical comfort bounds (<strong>ASHRAE 55</strong>) and electrical harmonics (<strong>IEEE 519</strong>). High blast-radius operations route to the Human-in-the-Loop Approval Queue.
            </p>
          </div>

          {/* Card 4: Google Cloud Stack */}
          <div
            style={{
              padding: "0.85rem",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--bg-glass)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--sky)", marginBottom: "0.35rem" }}>
              <Database size={14} />
              <strong style={{ fontSize: "0.8125rem" }}>Google Cloud Integration</strong>
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--text-2)", lineHeight: 1.45 }}>
              Powered by <strong>Vertex AI (Gemini 2.5 Pro & Flash)</strong>, partitioned <strong>BigQuery</strong> telemetry time-series, <strong>Cloud Run</strong> serverless execution, and <strong>Google Secret Manager</strong> runtime credential isolation.
            </p>
          </div>
        </div>
      )}
    </GlassPanel>
  );
}
