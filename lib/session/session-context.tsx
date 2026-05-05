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

import { decodeBase64 } from "@/lib/crypto/base64";
import { unwrapPrivateKeyPkcs8 } from "@/lib/crypto/identity";
import { logoutWhisperbox, refreshWhisperbox } from "@/lib/api/whisperbox-api";
import {
  clearPersistedAuth,
  readPersistedAuth,
  writePersistedAuth,
} from "@/lib/session/session-storage";
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
  /** True after client has attempted to read persisted auth from localStorage. */
  sessionRestored: boolean;
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
  unlockWithPassword: (password: string) => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

function persistFromState(s: SessionState) {
  if (!s.accessToken || !s.refreshToken || !s.user || s.accessExpiresAtMs == null) {
    clearPersistedAuth();
    return;
  }
  writePersistedAuth({
    accessToken: s.accessToken,
    refreshToken: s.refreshToken,
    accessExpiresAtMs: s.accessExpiresAtMs,
    user: s.user,
  });
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>(emptySession);
  const [sessionRestored, setSessionRestored] = useState(false);
  const refreshLockRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        let snapshot = readPersistedAuth();
        if (snapshot && snapshot.accessExpiresAtMs <= Date.now() && snapshot.refreshToken) {
          try {
            const tr = await refreshWhisperbox(snapshot.refreshToken);
            if (cancelled) return;
            snapshot = {
              ...snapshot,
              accessToken: tr.access_token,
              accessExpiresAtMs: Date.now() + tr.expires_in * 1000,
            };
            writePersistedAuth(snapshot);
          } catch {
            clearPersistedAuth();
            snapshot = null;
          }
        }
        if (cancelled) return;
        if (snapshot && snapshot.accessExpiresAtMs > Date.now()) {
          setState({
            accessToken: snapshot.accessToken,
            refreshToken: snapshot.refreshToken,
            accessExpiresAtMs: snapshot.accessExpiresAtMs,
            user: snapshot.user,
            privateKey: null,
          });
        } else if (snapshot) {
          clearPersistedAuth();
        }
      } catch {
        clearPersistedAuth();
      } finally {
        if (!cancelled) setSessionRestored(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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
      writePersistedAuth({
        accessToken: args.accessToken,
        refreshToken: args.refreshToken,
        accessExpiresAtMs,
        user: args.user,
      });
    },
    [],
  );

  const clearSession = useCallback(() => {
    clearPersistedAuth();
    setState(emptySession);
  }, []);

  const unlockWithPassword = useCallback(async (password: string) => {
    const u = state.user;
    if (!u) throw new Error("No user profile loaded.");
    const salt = decodeBase64(u.pbkdf2_salt);
    const wrapped = decodeBase64(u.wrapped_private_key);
    let privateKey: CryptoKey;
    try {
      privateKey = await unwrapPrivateKeyPkcs8(wrapped, password, salt);
    } catch {
      throw new Error("Incorrect password or corrupted key material.");
    }
    setState((s) => ({ ...s, privateKey }));
  }, [state.user]);

  const signOut = useCallback(async () => {
    const at = state.accessToken;
    const rt = state.refreshToken;
    if (at && rt) {
      try {
        await logoutWhisperbox(rt, at);
      } catch {
        /* still clear locally */
      }
    }
    clearPersistedAuth();
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
        setState((s) => {
          const next: SessionState = {
            ...s,
            accessToken: tr.access_token,
            accessExpiresAtMs: Date.now() + tr.expires_in * 1000,
          };
          persistFromState(next);
          return next;
        });
      } catch {
        clearPersistedAuth();
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
      sessionRestored,
      setAuthenticatedSession,
      clearSession,
      signOut,
      refreshAccessToken,
      unlockWithPassword,
    }),
    [
      state,
      sessionRestored,
      setAuthenticatedSession,
      clearSession,
      signOut,
      refreshAccessToken,
      unlockWithPassword,
    ],
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
