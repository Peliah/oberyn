"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { UserProfile } from "@/types/whisperbox-api";

export type SessionState = {
  accessToken: string | null;
  refreshToken: string | null;
  accessExpiresAtMs: number | null;
  user: UserProfile | null;
  /** RSA-OAEP private key — memory only, never persisted */
  privateKey: CryptoKey | null;
};

const emptySession: SessionState = {
  accessToken: null,
  refreshToken: null,
  accessExpiresAtMs: null,
  user: null,
  privateKey: null,
};

type SessionContextValue = SessionState & {
  setAuthenticatedSession: (args: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: UserProfile;
    privateKey: CryptoKey;
  }) => void;
  clearSession: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>(emptySession);

  const setAuthenticatedSession = useCallback(
    (args: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
      user: UserProfile;
      privateKey: CryptoKey;
    }) => {
      const accessExpiresAtMs = Date.now() + args.expiresIn * 1000;
      setState({
        accessToken: args.accessToken,
        refreshToken: args.refreshToken,
        accessExpiresAtMs,
        user: args.user,
        privateKey: args.privateKey,
      });
    },
    [],
  );

  const clearSession = useCallback(() => {
    setState(emptySession);
  }, []);

  const value = useMemo(
    (): SessionContextValue => ({
      ...state,
      setAuthenticatedSession,
      clearSession,
    }),
    [state, setAuthenticatedSession, clearSession],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return ctx;
}
