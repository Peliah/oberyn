"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";

import { queryKeys } from "@/lib/query-keys";
import { connectWhisperboxSocket, sendWsChatMessage } from "@/lib/ws/whisperbox-socket";
import type { EncryptedPayload } from "@/types/encrypted-payload";

export function useWhisperboxSocket(accessToken: string | null) {
  const qc = useQueryClient();
  const socketRef = useRef<WebSocket | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      socketRef.current = null;
      return;
    }

    const { disconnect, socket } = connectWhisperboxSocket(accessToken, {
      onOpen: () => {
        socketRef.current = socket;
        setReady(true);
      },
      onClose: () => {
        socketRef.current = null;
        setReady(false);
      },
      onJsonMessage: (data) => {
        if (!data || typeof data !== "object" || !("type" in data)) return;
        const t = String((data as { type: unknown }).type);
        if (t === "message.receive" || t.includes("receive")) {
          void qc.invalidateQueries({
            predicate: (q) => q.queryKey[0] === queryKeys.conversations[0],
          });
        }
      },
    });

    socketRef.current = socket;

    return () => {
      disconnect();
      socketRef.current = null;
    };
  }, [accessToken, qc]);

  const send = useCallback((toUserId: string, payload: EncryptedPayload) => {
    return sendWsChatMessage(socketRef.current, toUserId, payload);
  }, []);

  return { send, ready };
}
