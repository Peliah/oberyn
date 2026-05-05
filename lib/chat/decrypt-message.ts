import { decryptEnvelope } from "@/lib/crypto/envelope";
import type { EncryptedPayload } from "@/types/encrypted-payload";
import type { MessageResponse } from "@/types/whisperbox-api";

function isEncryptedPayload(x: unknown): x is EncryptedPayload {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.ciphertext === "string" &&
    typeof o.iv === "string" &&
    typeof o.encryptedKey === "string" &&
    typeof o.encryptedKeyForSelf === "string"
  );
}

export async function decryptChatMessage(
  msg: MessageResponse,
  myUserId: string,
  privateKey: CryptoKey,
  subtle: SubtleCrypto = crypto.subtle,
): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  try {
    if (!isEncryptedPayload(msg.payload)) {
      return { ok: false, error: "Unexpected payload shape" };
    }
    const useSelfCopy = msg.from_user_id === myUserId;
    const text = await decryptEnvelope(
      { payload: msg.payload, useSelfCopy, privateKey },
      subtle,
    );
    return { ok: true, text };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Decrypt failed" };
  }
}
