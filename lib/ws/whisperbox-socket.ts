import { getWhisperboxWsUrl } from "@/lib/env";
import type { EncryptedPayload } from "@/types/encrypted-payload";

export type WhisperboxSocketHandlers = {
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (ev: Event) => void;
  onJsonMessage?: (data: unknown) => void;
};

export function connectWhisperboxSocket(
  accessToken: string,
  handlers: WhisperboxSocketHandlers,
): { disconnect: () => void; socket: WebSocket } {
  const ws = new WebSocket(getWhisperboxWsUrl(accessToken));

  ws.onopen = () => handlers.onOpen?.();
  ws.onclose = () => handlers.onClose?.();
  ws.onerror = (ev) => handlers.onError?.(ev);
  ws.onmessage = (ev) => {
    try {
      const data = JSON.parse(String(ev.data)) as unknown;
      handlers.onJsonMessage?.(data);
    } catch {
      /* ignore */
    }
  };

  return {
    disconnect: () => ws.close(),
    socket: ws,
  };
}

export function sendWsChatMessage(
  ws: WebSocket | null,
  toUserId: string,
  payload: EncryptedPayload,
): boolean {
  if (!ws || ws.readyState !== WebSocket.OPEN) return false;
  ws.send(JSON.stringify({ type: "message.send", to: toUserId, payload }));
  return true;
}
