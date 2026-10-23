"use client";

import React from "react";
import { AgentStatusCard } from "@/components/dashboard/AgentStatusCard";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { MOCK_AGENTS } from "@/lib/mock-data";
import { Bot, Network, ArrowRight, ShieldCheck, Terminal, Layers } from "lucide-react";

export default function AgentsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Page Title */}
      <div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-1)", letterSpacing: "-0.02em" }}>
          Agent Constellation
        </h1>
        <p style={{ fontSize: "0.8125rem", color: "var(--text-3)", marginTop: "0.2rem" }}>
          Autonomous Multi-Agent Topology · Supervised Blackboard Architecture on Vertex AI & Gemini
        </p>
      </div>

      {/* High-level Constellation Architecture Flow */}
      <GlassPanel style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Network size={16} color="var(--teal)" />
          <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--text-1)" }}>
            Multi-Agent Execution Pipeline & Gating
          </h3>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem",
            padding: "1rem",
            backgroundColor: "var(--bg-glass)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          {MOCK_AGENTS.map((agent, idx) => (
            <React.Fragment key={agent.id}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}>
                <span className="font-mono" style={{ fontSize: "0.6875rem", color: "var(--teal)", fontWeight: 700 }}>
                  {agent.codename}
                </span>
                <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-1)" }}>
                  {agent.name.split(" ")[0]}
                </span>
                <span
                  style={{
                    fontSize: "0.625rem",
                    color: "var(--text-3)",
                    backgroundColor: "var(--bg-surface)",
                    border: "1px solid var(--border-subtle)",
                    padding: "1px 6px",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  {agent.model.split(" ")[1]}
                </span>
              </div>
              {idx < MOCK_AGENTS.length - 1 && (
                <ArrowRight size={14} color="var(--text-3)" style={{ opacity: 0.6 }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </GlassPanel>

      {/* Grid of All 5 Agents */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {MOCK_AGENTS.map((agent) => (
          <AgentStatusCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
}
