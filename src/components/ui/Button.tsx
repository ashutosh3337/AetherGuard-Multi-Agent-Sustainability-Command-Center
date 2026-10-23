"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "accent";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  loading?: boolean;
}

export function Button({
  children,
  variant = "secondary",
  size = "md",
  icon,
  loading = false,
  disabled,
  style,
  onMouseEnter,
  onMouseLeave,
  ...props
}: ButtonProps) {
  let bg = "var(--bg-glass)";
  let color = "var(--text-1)";
  let border = "1px solid var(--border-subtle)";
  let shadow = "var(--shadow-sm)";

  if (variant === "primary" || variant === "accent") {
    bg = "linear-gradient(135deg, #2de2e6 0%, #34d399 100%)";
    color = "#060911";
    border = "1px solid rgba(45, 226, 230, 0.6)";
    shadow = "var(--shadow-glow-teal), var(--shadow-md)";
  } else if (variant === "danger") {
    bg = "rgba(248, 113, 113, 0.12)";
    color = "var(--coral)";
    border = "1px solid rgba(248, 113, 113, 0.35)";
    shadow = "none";
  } else if (variant === "ghost") {
    bg = "transparent";
    border = "1px solid transparent";
    shadow = "none";
  }

  const padY = size === "sm" ? "0.4rem" : size === "lg" ? "0.75rem" : "0.55rem";
  const padX = size === "sm" ? "0.85rem" : size === "lg" ? "1.35rem" : "1.05rem";
  const fontSize = size === "sm" ? "0.8125rem" : size === "lg" ? "0.9375rem" : "0.875rem";

  return (
    <button
      disabled={disabled || loading}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        padding: `${padY} ${padX}`,
        borderRadius: "var(--radius-md)",
        background: bg,
        color: color,
        border: border,
        boxShadow: shadow,
        fontSize: fontSize,
        fontWeight: variant === "primary" || variant === "accent" ? 700 : 600,
        letterSpacing: "0.01em",
        cursor: disabled || loading ? "not-allowed" : "pointer",
        opacity: disabled || loading ? 0.6 : 1,
        transition: "all 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
        userSelect: "none",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.transform = "translateY(-1px)";
          if (variant === "secondary") {
            e.currentTarget.style.borderColor = "var(--border-strong)";
            e.currentTarget.style.boxShadow = "var(--shadow-md)";
          }
        }
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.transform = "translateY(0)";
          if (variant === "secondary") {
            e.currentTarget.style.borderColor = "var(--border-subtle)";
            e.currentTarget.style.boxShadow = "var(--shadow-sm)";
          }
        }
        onMouseLeave?.(e);
      }}
      onMouseDown={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.transform = "translateY(1px) scale(0.99)";
        }
      }}
      onMouseUp={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.transform = "translateY(-1px)";
        }
      }}
      {...props}
    >
      {loading ? (
        <span
          style={{
            display: "inline-block",
            width: "14px",
            height: "14px",
            borderRadius: "50%",
            border: "2px solid currentColor",
            borderTopColor: "transparent",
            animation: "spin 0.8s linear infinite",
          }}
        />
      ) : (
        icon
      )}
      {children}
    </button>
  );
}
