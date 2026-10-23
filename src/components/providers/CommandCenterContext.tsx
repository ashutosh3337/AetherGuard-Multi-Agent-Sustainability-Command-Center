"use client";

import React, { createContext, useContext, useState } from "react";
import type { Agent, Insight, PendingAction } from "@/lib/types/domain";
import { MOCK_AGENTS, MOCK_INSIGHTS, MOCK_PENDING_ACTIONS } from "@/lib/mock-data";

export type ContextPanelEntity =
  | { type: "agent"; data: Agent }
  | { type: "insight"; data: Insight }
  | { type: "action"; data: PendingAction }
  | null;

interface CommandCenterContextValue {
  facility: string;
  setFacility: (facility: string) => void;
  selectedEntity: ContextPanelEntity;
  setSelectedEntity: (entity: ContextPanelEntity) => void;
  contextPanelOpen: boolean;
  setContextPanelOpen: (open: boolean) => void;
  toggleContextPanel: () => void;
}

const CommandCenterContext = createContext<CommandCenterContextValue | null>(null);

export function CommandCenterProvider({ children }: { children: React.ReactNode }) {
  const [facility, setFacility] = useState("All Facilities (4 Active)");
  const [selectedEntity, setSelectedEntity] = useState<ContextPanelEntity>({
    type: "agent",
    data: MOCK_AGENTS[0]!,
  });
  const [contextPanelOpen, setContextPanelOpen] = useState(true);

  const toggleContextPanel = () => setContextPanelOpen((prev) => !prev);

  return (
    <CommandCenterContext.Provider
      value={{
        facility,
        setFacility,
        selectedEntity,
        setSelectedEntity,
        contextPanelOpen,
        setContextPanelOpen,
        toggleContextPanel,
      }}
    >
      {children}
    </CommandCenterContext.Provider>
  );
}

export function useCommandCenter() {
  const ctx = useContext(CommandCenterContext);
  if (!ctx) throw new Error("useCommandCenter must be used within CommandCenterProvider");
  return ctx;
}
