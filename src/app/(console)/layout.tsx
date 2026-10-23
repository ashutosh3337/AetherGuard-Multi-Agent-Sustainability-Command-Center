import React from "react";
import { getSessionUser } from "@/lib/server/session";
import { CommandShell } from "@/components/shell/CommandShell";
import type { SessionUser } from "@/lib/auth/roles";

export const dynamic = "force-dynamic";

export default async function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionUser = await getSessionUser();

  // Fallback demo user for local UI exploration
  const user: SessionUser = sessionUser ?? {
    uid: "usr-admin-demo",
    email: "commander@aetherguard.earth",
    name: "Alex Vance (Chief Sustainability Officer)",
    picture: null,
    emailVerified: true,
    role: "admin",
    orgId: "org-demo",
  };

  return <CommandShell user={user}>{children}</CommandShell>;
}
