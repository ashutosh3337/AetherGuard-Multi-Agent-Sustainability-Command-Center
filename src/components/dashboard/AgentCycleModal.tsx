"use client";

import React, { useEffect, useState } from "react";
import type { AgentReasoningStep } from "@/lib/types/domain";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";
import { ImpactBadge } from "@/components/ui/ImpactBadge";
import {
  Sparkles,
  CheckCircle2,
  Cpu,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Terminal,
  X,
  Radio,
} from "lucide-react";

interface AgentCycleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCycleComplete: (results: {
    co2Added: number;
    costAdded: number;
    waterAdded: number;
    energyAdded: number;
  }) => void;
}

const STEPS: AgentReasoningStep[] = [
  {
    agentId: "orchestrator",
    codename: "ATLAS-01",
    agentName: "Aether Orchestrator",
    model: "Gemini 2.5 Pro",
    action: "Task Decomposition & Facility Telemetry Ingestion",
    detail:
      "Ingesting BigQuery partition `telemetry_20261023`. Identified +18.4% thermodynamic drift across Campus Alpha Chiller Loop B.",
    toolCall: "$decompose_goal(facility='Campus Alpha', metric='thermal_drift')",
    verdict: "analyzing",
  },
  {
    agentId: "analyst",
    codename: "CHRONOS-02",
    agentName: "Telemetry & Anomaly Analyst",
    model: "Gemini 2.5 Flash",
    action: "BigQuery Time-Series Anomaly Detection",
    detail:
      "Cross-referenced historical sensory baselines. Confirmed chiller return water temperature delta of +2.8°C exceeding normal variance threshold.",
    toolCall: "$detect_anomalies(substation='Sub-04', confidence=0.96)",
    verdict: "analyzing",
  },
  {
    agentId: "optimizer",
    codename: "PROMETHEUS-03",
    agentName: "Resource & Carbon Optimizer",
    model: "Gemini 2.5 Flash",
    action: "Algorithmic Intervention & Precooling Synthesis",
    detail:
      "Synthesized 450 kW battery peak-shaving schedule and precooling offset aligned with low grid carbon intensity window.",
    toolCall: "$simulate_intervention(shift_window='14:00-18:00', load_kw=450)",
    verdict: "optimized",
  },
  {
    agentId: "safety",
    codename: "AEGIS-04",
    agentName: "Safety & Compliance Sentinel",
    model: "Gemini 2.5 Pro",
    action: "Deterministic Guardrail & Standards Verification",
    detail:
      "Validated against ASHRAE 55 thermal comfort envelope and IEEE 519 electrical harmonics. Blast radius zero. Approved for autonomous execution.",
    toolCall: "$check_policy(standard='ASHRAE_55', tolerance='±1.5C')",
    verdict: "verified",
  },
  {
    agentId: "executor",
    codename: "HERMES-05",
    agentName: "Autonomous Actuator Dispatcher",
    model: "Gemini 2.5 Flash",
    action: "Closed-Loop Actuator Dispatch & Audit Ledger Hashing",
    detail:
      "Dispatched BACnet frequency modulation command to VFD Pumps 03 & 04. Minted SHA-256 audit log `#8f2a9c1e`.",
    toolCall: "$dispatch_bacnet(device_id='BACNET_PUMP_03', freq_hz=48.5)",
    verdict: "dispatched",
  },
];

export function AgentCycleModal({ isOpen, onClose, onCycleComplete }: AgentCycleModalProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setActiveStep(0);
      setCompleted(false);
      return;
    }

    const timer = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setCompleted(true);
          onCycleComplete({
            co2Added: 1.8,
            costAdded: 840,
            waterAdded: 14.2,
            energyAdded: 4.6,
          });
          return prev;
        }
      });
    }, 600);

    return () => clearInterval(timer);
  }, [isOpen, onCycleComplete]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(6, 9, 17, 0.8)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "1rem",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && completed) onClose();
      }}
    >
      <GlassPanel
        style={{
          width: "100%",
          maxWidth: "680px",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
          padding: "1.75rem",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), var(--shadow-glow-teal)",
          border: "1px solid var(--border-glass)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "var(--radius-md)",
                background: "linear-gradient(135deg, #2de2e6 0%, #34d399 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "var(--shadow-glow-teal)",
              }}
            >
              <Radio size={18} color="#060911" />
            </div>
            <div>
              <h2 style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--text-1)", letterSpacing: "-0.02em" }}>
                Autonomous Multi-Agent Consensus Cycle
              </h2>
              <span style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>
                Supervised Blackboard Architecture · Google Cloud Vertex AI (Gemini 2.5)
              </span>
            </div>
          </div>

          {completed && (
            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-3)",
                cursor: "pointer",
                padding: "4px",
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div
          style={{
            width: "100%",
            height: "4px",
            backgroundColor: "var(--bg-surface)",
            borderRadius: "9999px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${((activeStep + 1) / STEPS.length) * 100}%`,
              height: "100%",
              background: "linear-gradient(90deg, var(--teal), var(--emerald))",
              transition: "width 0.4s ease",
            }}
          />
        </div>

        {/* Steps List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "380px", overflowY: "auto" }}>
          {STEPS.map((step, idx) => {
            const isCurrent = idx === activeStep;
            const isDone = idx <= activeStep;

            return (
              <div
                key={step.agentId}
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: isCurrent
                    ? "rgba(45, 226, 230, 0.08)"
                    : isDone
                    ? "var(--bg-glass)"
                    : "rgba(255, 255, 255, 0.01)",
                  border: isCurrent
                    ? "1px solid var(--teal)"
                    : isDone
                    ? "1px solid var(--border-subtle)"
                    : "1px solid transparent",
                  opacity: isDone ? 1 : 0.35,
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "flex-start",
                }}
              >
                {/* Step Indicator */}
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: isCurrent
                      ? "var(--teal)"
                      : isDone
                      ? "rgba(52, 211, 153, 0.2)"
                      : "var(--bg-surface)",
                    color: isCurrent ? "#060911" : isDone ? "var(--emerald)" : "var(--text-3)",
                    fontWeight: 700,
                    fontSize: "0.6875rem",
                    flexShrink: 0,
                    marginTop: "2px",
                  }}
                >
                  {isDone && !isCurrent ? <CheckCircle2 size={14} /> : idx + 1}
                </div>

                {/* Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                    <span className="font-mono" style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--teal)" }}>
                      {step.codename}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>•</span>
                    <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-1)" }}>
                      {step.agentName}
                    </span>
                    <span
                      className="glass-pill"
                      style={{ fontSize: "0.625rem", color: "var(--text-3)", padding: "1px 6px" }}
                    >
                      {step.model}
                    </span>
                  </div>

                  <p style={{ fontSize: "0.75rem", color: "var(--text-2)", marginTop: "0.25rem", lineHeight: 1.4 }}>
                    {step.detail}
                  </p>

                  <div
                    className="font-mono"
                    style={{
                      marginTop: "0.35rem",
                      fontSize: "0.6875rem",
                      color: "var(--text-3)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.35rem",
                    }}
                  >
                    <Terminal size={12} color="var(--teal)" />
                    <code>{step.toolCall}</code>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Realized Impact Banner on Completion */}
        {completed && (
          <div
            style={{
              padding: "0.85rem 1.15rem",
              borderRadius: "var(--radius-md)",
              background: "linear-gradient(135deg, rgba(45, 226, 230, 0.12) 0%, rgba(52, 211, 153, 0.15) 100%)",
              border: "1px solid rgba(52, 211, 153, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--emerald)" }}>
                <CheckCircle2 size={16} />
                <span style={{ fontSize: "0.8125rem", fontWeight: 700, letterSpacing: "0.02em" }}>
                  Autonomous Intervention Cycle Completed
                </span>
              </div>
              <p style={{ fontSize: "0.75rem", color: "var(--text-2)", marginTop: "0.15rem" }}>
                Actuators safely modulated. Cryptographic audit verification logged.
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <ImpactBadge kind="co2" value={1.8} size="sm" signed={true} />
              <ImpactBadge kind="cost" value={840} size="sm" signed={true} />
              <ImpactBadge kind="water" value={14.2} size="sm" signed={true} />
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
          <Button
            variant={completed ? "primary" : "secondary"}
            size="md"
            onClick={onClose}
            disabled={!completed}
          >
            {completed ? "Apply to Command Center" : "Coordinating Constellation..."}
          </Button>
        </div>
      </GlassPanel>
    </div>
  );
}
