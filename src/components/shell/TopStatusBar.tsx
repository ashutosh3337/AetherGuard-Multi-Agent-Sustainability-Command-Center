"use client";

import React, { useEffect, useState } from "react";
import type { SystemHealth } from "@/lib/types/domain";
import { MOCK_AGENTS, MOCK_SYSTEM_HEALTH } from "@/lib/mock-data";
import { AgentStatusPill } from "@/components/dashboard/AgentStatusPill";
import { StatusDot } from "@/components/ui/StatusDot";
import { useCommandCenter } from "@/components/providers/CommandCenterContext";
import { formatDuration } from "@/lib/format";
import {
  Building2,
  Clock,
  Shield,
  PanelRightClose,
  PanelRightOpen,
  Wifi,
  Sparkles,
} from "lucide-react";
import { ThemeToggle } from "@/components/shell/ThemeToggle";
import type { SessionUser } from "@/lib/auth/roles";

interface TopStatusBarProps {
  user?: SessionUser | null;
}

export function TopStatusBar({ user }: TopStatusBarProps) {
  const { facility, setFacility, contextPanelOpen, toggleContextPanel } = useCommandCenter();
  const [health, setHealth] = useState<SystemHealth>(MOCK_SYSTEM_HEALTH);
  const [countdown, setCountdown] = useState(health.nextCycleInSec);

  // Live countdown ticker for the autonomous 15m cycle
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 900));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header
      style={{
        height: "56px",
        minHeight: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 1.25rem",
        backgroundColor: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-subtle)",
        zIndex: 30,
        gap: "1rem",
        transition: "background-color 0.25s ease, border-color 0.25s ease",
      }}
    >
      {/* Left: Facility Switcher & Live Health */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
        {/* Facility Dropdown */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.45rem",
            padding: "0.2rem 0.5rem",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border-subtle)",
            background: "var(--bg-glass)",
          }}
        >
          <Building2 size={15} color="var(--teal)" />
          <select
            value={facility}
            onChange={(e) => setFacility(e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--text-1)",
              fontSize: "0.8125rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            <option value="All Facilities (4 Active)" style={{ background: "var(--bg-surface)", color: "var(--text-1)" }}>
              All Facilities (4 Active)
            </option>
            <option value="Campus Alpha (HQ)" style={{ background: "var(--bg-surface)", color: "var(--text-1)" }}>
              Campus Alpha (HQ)
            </option>
            <option value="Plant Beta (Fab)" style={{ background: "var(--bg-surface)", color: "var(--text-1)" }}>
              Plant Beta (Fab)
            </option>
            <option value="Omega Datacenter" style={{ background: "var(--bg-surface)", color: "var(--text-1)" }}>
              Omega Datacenter
            </option>
          </select>
        </div>

        {/* System Health */}
        <div
          className="glass-pill"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.3rem 0.7rem",
            fontSize: "0.75rem",
          }}
        >
          <StatusDot status={health.status} size="sm" />
          <span style={{ color: "var(--emerald)", fontWeight: 700, letterSpacing: "0.04em" }}>SYSTEM NOMINAL</span>
          <span style={{ color: "var(--text-3)" }}>•</span>
          <span className="tabular-nums font-mono" style={{ color: "var(--text-2)" }}>
            {health.latencyMs}ms
          </span>
        </div>

        {/* Autonomous Cycle Countdown */}
        <div
          className="glass-pill"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.3rem 0.7rem",
            fontSize: "0.75rem",
          }}
          title="Autonomous Multi-Agent Loop cycle interval"
        >
          <Clock size={13} color="var(--teal)" />
          <span style={{ color: "var(--text-3)", fontWeight: 500 }}>Next Cycle:</span>
          <span className="tabular-nums font-mono" style={{ color: "var(--teal)", fontWeight: 700 }}>
            {formatDuration(countdown)}
          </span>
        </div>
      </div>

      {/* Center: Live Agent Status Pills */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          overflowX: "auto",
        }}
      >
        {MOCK_AGENTS.map((agent) => (
          <AgentStatusPill key={agent.id} agent={agent} />
        ))}
      </div>

      {/* Right: Theme Toggle, User Role & Context Toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
        {/* Dark / Light Mode Toggle */}
        <ThemeToggle />

        {/* Role Pill */}
        <div
          className="glass-pill"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            padding: "0.3rem 0.65rem",
            fontSize: "0.75rem",
          }}
        >
          <Shield size={13} color="var(--emerald)" />
          <span style={{ color: "var(--text-3)", fontWeight: 500 }}>Role:</span>
          <span
            style={{
              color: "var(--emerald)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.03em",
            }}
          >
            {user?.role ?? "ADMIN"}
          </span>
        </div>

        {/* Context Panel Toggle */}
        <button
          onClick={toggleContextPanel}
          className="glass-pill"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            padding: "0.3rem 0.65rem",
            color: contextPanelOpen ? "var(--teal)" : "var(--text-2)",
            border: contextPanelOpen ? "1px solid var(--teal)" : "1px solid var(--border-subtle)",
            cursor: "pointer",
            background: contextPanelOpen ? "rgba(45, 226, 230, 0.12)" : "var(--bg-glass)",
            transition: "all 0.2s ease",
          }}
          title={contextPanelOpen ? "Hide Inspector Panel" : "Show Inspector Panel"}
        >
          {contextPanelOpen ? <PanelRightClose size={15} /> : <PanelRightOpen size={15} />}
          <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>Inspector</span>
        </button>
      </div>
    </header>
  );
}
