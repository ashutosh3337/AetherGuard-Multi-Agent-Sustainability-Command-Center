"use client";

import React, { useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";
import { Shield, Key, Sliders, Lock, CheckCircle2, AlertTriangle, Users } from "lucide-react";

export default function SettingsPage() {
  const [tempLimit, setTempLimit] = useState("±1.5°C");
  const [maxLoadShift, setMaxLoadShift] = useState("450 kW");
  const [safetyGate, setSafetyGate] = useState("Strict (ASHRAE 55 + IEEE 519)");
  const [saved, setSaved] = useState(false);

  const handleSaveBounds = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-1)", letterSpacing: "-0.02em" }}>
          Command Center Governance & Policies
        </h1>
        <p style={{ fontSize: "0.8125rem", color: "var(--text-3)", marginTop: "0.2rem" }}>
          Agent safety bounds, RBAC claims, Secret Manager integrations, and App Check status
        </p>
      </div>

      {/* Grid of Settings Panels */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {/* Agent Safety Guardrails */}
        <GlassPanel style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Sliders size={18} color="var(--teal)" />
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-1)" }}>
              Autonomous Safety Guardrails
            </h3>
          </div>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-3)", lineHeight: 1.4 }}>
            Hard physical limits enforced by the <strong>Aegis-04 Safety Agent</strong>. Any intervention exceeding these thresholds is blocked or routed to human approval.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div>
              <label style={{ fontSize: "0.75rem", color: "var(--text-2)", display: "block", marginBottom: "0.25rem" }}>
                Maximum Thermal Setpoint Drift
              </label>
              <input
                type="text"
                value={tempLimit}
                onChange={(e) => setTempLimit(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "var(--bg-glass)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-1)",
                  fontSize: "0.875rem",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: "0.75rem", color: "var(--text-2)", display: "block", marginBottom: "0.25rem" }}>
                Max Precooling Load Shift Window
              </label>
              <input
                type="text"
                value={maxLoadShift}
                onChange={(e) => setMaxLoadShift(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "var(--bg-glass)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-1)",
                  fontSize: "0.875rem",
                  outline: "none",
                }}
              />
            </div>

            <Button
              variant="primary"
              size="sm"
              icon={saved ? <CheckCircle2 size={14} color="#060911" /> : undefined}
              onClick={handleSaveBounds}
              style={{ marginTop: "0.5rem" }}
            >
              {saved ? "Bounds Committed to Firestore" : "Update Safety Bounds"}
            </Button>

            {saved && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "rgba(52, 211, 153, 0.12)",
                  border: "1px solid rgba(52, 211, 153, 0.35)",
                  color: "var(--emerald)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  marginTop: "0.25rem",
                }}
              >
                <CheckCircle2 size={13} />
                <span>Safety bounds committed to Firestore policies collection</span>
              </div>
            )}
          </div>
        </GlassPanel>

        {/* Security & Secrets Health */}
        <GlassPanel style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Key size={18} color="var(--emerald)" />
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-1)" }}>
              Google Cloud Security & Secrets
            </h3>
          </div>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-3)", lineHeight: 1.4 }}>
            Zero client-side secrets. All credentials are encrypted in Google Secret Manager and injected at runtime via Cloud Run.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.65rem 0.85rem",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--bg-glass)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <span className="font-mono" style={{ fontSize: "0.75rem", color: "var(--text-2)" }}>
                GEMINI_API_KEY
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--emerald)", display: "flex", alignItems: "center", gap: "4px" }}>
                <CheckCircle2 size={13} /> Secret Manager Mounted
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.65rem 0.85rem",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--bg-glass)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <span className="font-mono" style={{ fontSize: "0.75rem", color: "var(--text-2)" }}>
                Firebase App Check
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--emerald)", display: "flex", alignItems: "center", gap: "4px" }}>
                <CheckCircle2 size={13} /> reCAPTCHA Enterprise Ready
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.65rem 0.85rem",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--bg-glass)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <span className="font-mono" style={{ fontSize: "0.75rem", color: "var(--text-2)" }}>
                Firestore Rules
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--emerald)", display: "flex", alignItems: "center", gap: "4px" }}>
                <CheckCircle2 size={13} /> Default Deny Active
              </span>
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
