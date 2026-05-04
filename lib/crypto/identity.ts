import { decodeBase64, encodeBase64 } from "@/lib/crypto/base64";
import { bufferSource } from "@/lib/crypto/buffer-source";
import {
  AES_GCM_IV_BYTES,
  PBKDF2_SALT_BYTES,
  RSA_MODULUS_LENGTH,
  RSA_OAEP_HASH,
  RSA_PUBLIC_EXPONENT,
} from "@/lib/crypto/constants";
import { derivePrivateKeyWrapKey } from "@/lib/crypto/pbkdf2";

const RSA_OAEP_ALGO: RsaHashedImportParams = {
  name: "RSA-OAEP",
  hash: RSA_OAEP_HASH,
};

const RSA_OAEP_GEN: RsaHashedKeyGenParams = {
  name: "RSA-OAEP",
  modulusLength: RSA_MODULUS_LENGTH,
  publicExponent: RSA_PUBLIC_EXPONENT,
  hash: RSA_OAEP_HASH,
};

export type IdentityKeyPair = {
  publicKey: CryptoKey;
  privateKey: CryptoKey;
};

export async function generateIdentityKeyPair(
  subtle: SubtleCrypto = crypto.subtle,
): Promise<IdentityKeyPair> {
  const pair = await subtle.generateKey(RSA_OAEP_GEN, true, ["encrypt", "decrypt"]);
  return { publicKey: pair.publicKey, privateKey: pair.privateKey };
}

export async function exportPublicKeySpkiBase64(
  publicKey: CryptoKey,
  subtle: SubtleCrypto = crypto.subtle,
): Promise<string> {
  const spki = await subtle.exportKey("spki", publicKey);
  return encodeBase64(new Uint8Array(spki));
}

export function generatePbkdf2Salt(): Uint8Array {
  const salt = new Uint8Array(PBKDF2_SALT_BYTES);
  crypto.getRandomValues(salt);
  return salt;
}

function randomIv(): Uint8Array {
  const iv = new Uint8Array(AES_GCM_IV_BYTES);
  crypto.getRandomValues(iv);
  return iv;
}

export async function wrapPrivateKeyPkcs8(
  privateKey: CryptoKey,
  password: string,
  salt: Uint8Array,
  subtle: SubtleCrypto = crypto.subtle,
): Promise<Uint8Array> {
  const pkcsBuf = await subtle.exportKey("pkcs8", privateKey);
  const pkcs = new Uint8Array(pkcsBuf);
  const wrapKey = await derivePrivateKeyWrapKey(password, salt, subtle);
  const iv = randomIv();
  const ciphertextBuf = await subtle.encrypt(
    { name: "AES-GCM", iv: bufferSource(iv) },
    wrapKey,
    bufferSource(pkcs),
  );
  const ciphertext = new Uint8Array(ciphertextBuf);
  const out = new Uint8Array(iv.length + ciphertext.length);
  out.set(iv, 0);
  out.set(ciphertext, iv.length);
  return out;
}

export async function unwrapPrivateKeyPkcs8(
  wrappedPkcs8: Uint8Array,
  password: string,
  salt: Uint8Array,
  subtle: SubtleCrypto = crypto.subtle,
): Promise<CryptoKey> {
  const minLen = AES_GCM_IV_BYTES + 16;
  if (wrappedPkcs8.length < minLen) {
    throw new Error("Wrapped private key blob is too short or corrupted.");
  }

  const iv = wrappedPkcs8.subarray(0, AES_GCM_IV_BYTES);
  const ciphertext = wrappedPkcs8.subarray(AES_GCM_IV_BYTES);
  const wrapKey = await derivePrivateKeyWrapKey(password, salt, subtle);
  const pkcsBuf = await subtle.decrypt(
    { name: "AES-GCM", iv: bufferSource(iv) },
    wrapKey,
    bufferSource(ciphertext),
  );

  return subtle.importKey("pkcs8", bufferSource(new Uint8Array(pkcsBuf)), RSA_OAEP_GEN, true, [
    "decrypt",
  ]);
}

export async function importRsaOaepPublicKey(
  spkiBase64: string,
  subtle: SubtleCrypto = crypto.subtle,
): Promise<CryptoKey> {
  const raw = decodeBase64(spkiBase64);
  return subtle.importKey("spki", bufferSource(raw), RSA_OAEP_ALGO, false, ["encrypt"]);
}
