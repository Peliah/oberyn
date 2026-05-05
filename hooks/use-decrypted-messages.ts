"use client";

import { startTransition, useEffect, useMemo, useState } from "react";

import { decryptChatMessage } from "@/lib/chat/decrypt-message";
import type { MessageResponse } from "@/types/whisperbox-api";

export function useDecryptedBodies(
  messages: MessageResponse[],
  myUserId: string,
  privateKey: CryptoKey | null,
): Record<string, string> {
  const [map, setMap] = useState<Record<string, string>>({});
  const fingerprint = useMemo(
    () => messages.map((m) => `${m.id}:${m.created_at}`).join("|"),
    [messages],
  );

  useEffect(() => {
    if (!privateKey || messages.length === 0) {
      startTransition(() => setMap({}));
      return;
    }
    let cancelled = false;
    void Promise.all(
      messages.map(async (m) => {
        const r = await decryptChatMessage(m, myUserId, privateKey);
        return [m.id, r.ok ? r.text : "Unable to decrypt"] as const;
      }),
    ).then((pairs) => {
      if (cancelled) return;
      setMap(Object.fromEntries(pairs));
    });
    return () => {
      cancelled = true;
    };
  }, [fingerprint, messages, myUserId, privateKey]);

  return map;
}
