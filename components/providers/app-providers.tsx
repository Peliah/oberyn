"use client";

import type { ReactNode } from "react";

import { SessionUnlockGate } from "@/components/session/session-unlock-gate";
import { QueryProvider } from "@/providers/query-provider";
import { SessionProvider } from "@/lib/session/session-context";

/** Session (tokens + in-memory private key) and TanStack Query for API/crypto mutations. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        {children}
        <SessionUnlockGate />
      </QueryProvider>
    </SessionProvider>
  );
}
