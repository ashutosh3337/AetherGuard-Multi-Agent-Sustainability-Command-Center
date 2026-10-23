"use client";

import React from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        padding: "0.3rem 0.65rem",
        borderRadius: "9999px",
        border: "1px solid var(--border-subtle)",
        background: "var(--bg-glass)",
        color: "var(--text-1)",
        fontSize: "0.75rem",
        fontWeight: 600,
        cursor: "pointer",
        backdropFilter: "blur(12px)",
        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        boxShadow: "var(--shadow-sm)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--border-strong)";
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = "var(--shadow-md)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border-subtle)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "18px",
          height: "18px",
          borderRadius: "50%",
          backgroundColor: theme === "dark" ? "rgba(45, 226, 230, 0.15)" : "rgba(245, 158, 11, 0.15)",
          color: theme === "dark" ? "var(--teal)" : "#f59e0b",
          transition: "transform 0.3s ease",
        }}
      >
        {theme === "dark" ? <Moon size={12} strokeWidth={2.5} /> : <Sun size={12} strokeWidth={2.5} />}
      </div>
      <span style={{ letterSpacing: "0.03em" }}>{theme === "dark" ? "Dark" : "Light"}</span>
    </button>
  );
}
