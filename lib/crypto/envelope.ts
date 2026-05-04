import { bufferSource } from "@/lib/crypto/buffer-source";
import { decodeBase64, encodeBase64 } from "@/lib/crypto/base64";
import { AES_GCM_IV_BYTES } from "@/lib/crypto/constants";
import { importRsaOaepPublicKey } from "@/lib/crypto/identity";
import type { EncryptedPayload } from "@/types/encrypted-payload";

function randomIv(): Uint8Array {
  const iv = new Uint8Array(AES_GCM_IV_BYTES);
  crypto.getRandomValues(iv);
  return iv;
}

export type EnvelopeEncryptParams = {
  plaintext: string;
  /** Recipient SPKI base64 */
  recipientPublicKeySpkiBase64: string;
  /** Sender SPKI base64 — second RSA-OAEP wrap for copy-to-self */
  senderPublicKeySpkiBase64: string;
};

/**
 * Hybrid envelope: AES-GCM body + RSA-OAEP wrapped AES key for recipient and sender.
 */
export async function encryptEnvelope(
  params: EnvelopeEncryptParams,
  subtle: SubtleCrypto = crypto.subtle,
): Promise<EncryptedPayload> {
  const { plaintext, recipientPublicKeySpkiBase64, senderPublicKeySpkiBase64 } = params;

  const aesKey = await subtle.generateKey({ name: "AES-GCM", length: 256 }, true, [
    "encrypt",
    "decrypt",
  ]);
  const iv = randomIv();
  const enc = new TextEncoder();
  const ciphertextBuf = await subtle.encrypt(
    { name: "AES-GCM", iv: bufferSource(iv) },
    aesKey,
    enc.encode(plaintext),
  );

  const rawAes = await subtle.exportKey("raw", aesKey);
  const aesBytes = new Uint8Array(rawAes);

  const recipientPub = await importRsaOaepPublicKey(recipientPublicKeySpkiBase64, subtle);
  const senderPub = await importRsaOaepPublicKey(senderPublicKeySpkiBase64, subtle);

  const encryptedKeyBuf = await subtle.encrypt({ name: "RSA-OAEP" }, recipientPub, aesBytes);
  const encryptedKeyForSelfBuf = await subtle.encrypt({ name: "RSA-OAEP" }, senderPub, aesBytes);

  return {
    ciphertext: encodeBase64(new Uint8Array(ciphertextBuf)),
    iv: encodeBase64(iv),
    encryptedKey: encodeBase64(new Uint8Array(encryptedKeyBuf)),
    encryptedKeyForSelf: encodeBase64(new Uint8Array(encryptedKeyForSelfBuf)),
  };
}

export type EnvelopeDecryptParams = {
  payload: EncryptedPayload;
  /** Use `encryptedKey` when decrypting as recipient; use `encryptedKeyForSelf` when reading own sent copy */
  useSelfCopy: boolean;
  privateKey: CryptoKey;
};

export async function decryptEnvelope(
  params: EnvelopeDecryptParams,
  subtle: SubtleCrypto = crypto.subtle,
): Promise<string> {
  const { payload, useSelfCopy, privateKey } = params;

  const wrappedKeyB64 = useSelfCopy ? payload.encryptedKeyForSelf : payload.encryptedKey;
  const wrappedKey = decodeBase64(wrappedKeyB64);
  const aesRawBuf = await subtle.decrypt(
    { name: "RSA-OAEP" },
    privateKey,
    bufferSource(wrappedKey),
  );
  const aesRaw = new Uint8Array(aesRawBuf);

  const aesKey = await subtle.importKey(
    "raw",
    bufferSource(aesRaw),
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"],
  );

  const iv = decodeBase64(payload.iv);
  const ciphertext = decodeBase64(payload.ciphertext);
  const plaintextBuf = await subtle.decrypt(
    { name: "AES-GCM", iv: bufferSource(iv) },
    aesKey,
    bufferSource(ciphertext),
  );
  return new TextDecoder().decode(plaintextBuf);
}
