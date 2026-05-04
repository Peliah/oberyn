import { bufferSource } from "@/lib/crypto/buffer-source";
import { PBKDF2_ITERATIONS, RSA_OAEP_HASH } from "@/lib/crypto/constants";

/**
 * Derive AES-256-GCM from the password (same salt is stored on the user as `pbkdf2_salt`).
 * Used to encrypt the PKCS#8 private key. (AES-KW cannot wrap arbitrary PKCS#8 lengths in the Web Crypto API.)
 */
export async function derivePrivateKeyWrapKey(
  password: string,
  salt: Uint8Array,
  subtle: SubtleCrypto = crypto.subtle,
): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const passwordKey = await subtle.importKey("raw", enc.encode(password), "PBKDF2", false, [
    "deriveKey",
  ]);

  return subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: bufferSource(salt),
      iterations: PBKDF2_ITERATIONS,
      hash: RSA_OAEP_HASH,
    },
    passwordKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}
