/** Defaults — match WhisperBox expectations; tune PBKDF2 if unwrap fails against prod. */

export const PBKDF2_ITERATIONS = 100_000;
/** 128-bit salt per OpenAPI examples */
export const PBKDF2_SALT_BYTES = 16;

export const RSA_MODULUS_LENGTH = 2048;
export const RSA_PUBLIC_EXPONENT = new Uint8Array([0x01, 0x00, 0x01]);

/** RSA-OAEP + SHA-256 (MGF1 SHA-256) */
export const RSA_OAEP_HASH: AlgorithmIdentifier = "SHA-256";

/** AES-GCM: 96-bit IV for private-key wrap and message envelope */
export const AES_GCM_IV_BYTES = 12;
