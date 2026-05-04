export const PBKDF2_ITERATIONS = 100_000;
export const PBKDF2_SALT_BYTES = 16;

export const RSA_MODULUS_LENGTH = 2048;
export const RSA_PUBLIC_EXPONENT = new Uint8Array([0x01, 0x00, 0x01]);

export const RSA_OAEP_HASH: AlgorithmIdentifier = "SHA-256";

export const AES_GCM_IV_BYTES = 12;
