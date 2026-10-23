"use client";

import React from "react";
import { Sidebar } from "@/components/shell/Sidebar";
import { TopStatusBar } from "@/components/shell/TopStatusBar";
import { ContextPanel } from "@/components/dashboard/ContextPanel";
import { CommandCenterProvider } from "@/components/providers/CommandCenterContext";
import type { SessionUser } from "@/lib/auth/roles";

interface CommandShellProps {
  children: React.ReactNode;
  user?: SessionUser | null;
}

export function CommandShell({ children, user }: CommandShellProps) {
  return (
    <CommandCenterProvider>
      <div
        className="bg-grid-mission"
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          backgroundColor: "var(--bg-base)",
        }}
      >
        {/* Top Status Bar */}
        <TopStatusBar user={user} />

        {/* Middle Body: Sidebar + Main Content + Context Panel */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Left Sidebar */}
          <Sidebar />

          {/* Main Content Viewport */}
          <main
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            {children}
          </main>

          {/* Right Contextual Inspector Panel */}
          <ContextPanel />
        </div>
      </div>
    </CommandCenterProvider>
  );
}
