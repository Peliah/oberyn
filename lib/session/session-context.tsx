"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { logoutWhisperbox, refreshWhisperbox } from "@/lib/api/whisperbox-api";
import type { UserProfile } from "@/types/whisperbox-api";

const REFRESH_LEEWAY_MS = 120_000;

export type SessionState = {
  accessToken: string | null;
  refreshToken: string | null;
  accessExpiresAtMs: number | null;
  user: UserProfile | null;
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
  signOut: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>(emptySession);
  const refreshLockRef = useRef<Promise<void> | null>(null);

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

  const signOut = useCallback(async () => {
    const at = state.accessToken;
    const rt = state.refreshToken;
    if (at && rt) {
      try {
        await logoutWhisperbox(rt, at);
      } catch {}
    }
    setState(emptySession);
  }, [state.accessToken, state.refreshToken]);

  const refreshAccessToken = useCallback(async () => {
    const rt = state.refreshToken;
    if (!rt) return;
    if (refreshLockRef.current) {
      await refreshLockRef.current;
      return;
    }
    const run = (async () => {
      try {
        const tr = await refreshWhisperbox(rt);
        setState((s) => ({
          ...s,
          accessToken: tr.access_token,
          accessExpiresAtMs: Date.now() + tr.expires_in * 1000,
        }));
      } catch {
        setState(emptySession);
      }
    })();
    refreshLockRef.current = run.finally(() => {
      refreshLockRef.current = null;
    });
    await refreshLockRef.current;
  }, [state.refreshToken]);

  useEffect(() => {
    if (!state.accessExpiresAtMs || !state.refreshToken) return;
    const delay = Math.max(0, state.accessExpiresAtMs - Date.now() - REFRESH_LEEWAY_MS);
    const id = window.setTimeout(() => {
      void refreshAccessToken();
    }, delay);
    return () => clearTimeout(id);
  }, [state.accessExpiresAtMs, state.refreshToken, refreshAccessToken]);

  const value = useMemo(
    (): SessionContextValue => ({
      ...state,
      setAuthenticatedSession,
      clearSession,
      signOut,
      refreshAccessToken,
    }),
    [state, setAuthenticatedSession, clearSession, signOut, refreshAccessToken],
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
