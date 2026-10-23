"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bot,
  LineChart,
  Award,
  Settings,
  ShieldAlert,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/agents", label: "Agents", icon: Bot },
  { href: "/insights", label: "Insights", icon: LineChart },
  { href: "/impact", label: "Impact Ledger", icon: Award },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/session", { method: "DELETE" });
      document.cookie = "__session=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 UTC";
      window.location.href = "/login";
    } catch {
      document.cookie = "__session=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 UTC";
      window.location.href = "/login";
    }
  };

  return (
    <aside
      style={{
        width: "240px",
        minWidth: "240px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--bg-surface)",
        borderRight: "1px solid var(--border-glass)",
        padding: "1.25rem 0.85rem",
        zIndex: 25,
      }}
    >
      {/* Brand Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", padding: "0 0.5rem 1.25rem 0.5rem" }}>
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "var(--radius-md)",
            background: "linear-gradient(135deg, #2de2e6 0%, #34d399 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--shadow-glow-teal)",
          }}
        >
          <ShieldAlert size={18} color="#060911" />
        </div>
        <div>
          <span
            style={{
              fontSize: "1rem",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "var(--text-1)",
              display: "block",
            }}
          >
            Aether<span style={{ color: "var(--teal)" }}>Guard</span>
          </span>
          <span
            style={{
              fontSize: "0.625rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--text-3)",
              fontWeight: 600,
            }}
          >
            Mission Control
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "0.35rem", marginTop: "0.5rem" }}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.65rem 0.85rem",
                borderRadius: "var(--radius-md)",
                color: isActive ? "var(--teal)" : "var(--text-2)",
                backgroundColor: isActive ? "rgba(45, 226, 230, 0.1)" : "transparent",
                border: isActive ? "1px solid rgba(45, 226, 230, 0.3)" : "1px solid transparent",
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: isActive ? 600 : 500,
                transition: "all 0.15s ease",
                boxShadow: isActive ? "var(--shadow-sm)" : "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "var(--bg-glass)";
                  e.currentTarget.style.color = "var(--text-1)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "var(--text-2)";
                }
              }}
            >
              <Icon size={18} color={isActive ? "var(--teal)" : "var(--text-3)"} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Sign Out */}
      <div style={{ marginTop: "auto", paddingTop: "1rem", borderTop: "1px solid var(--border-subtle)" }}>
        <button
          onClick={handleSignOut}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.65rem 0.85rem",
            width: "100%",
            borderRadius: "var(--radius-md)",
            color: "var(--text-3)",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "0.875rem",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--coral)";
            e.currentTarget.style.backgroundColor = "rgba(248, 113, 113, 0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--text-3)";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
