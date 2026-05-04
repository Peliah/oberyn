import { describe, expect, it } from "vitest";

import { decodeBase64, encodeBase64 } from "@/lib/crypto/base64";
import { decryptEnvelope, encryptEnvelope } from "@/lib/crypto/envelope";
import {
  exportPublicKeySpkiBase64,
  generateIdentityKeyPair,
  generatePbkdf2Salt,
  unwrapPrivateKeyPkcs8,
  wrapPrivateKeyPkcs8,
} from "@/lib/crypto/identity";

const subtle = globalThis.crypto.subtle;

describe("base64", () => {
  it("round-trips random bytes", () => {
    const bytes = new Uint8Array(64);
    crypto.getRandomValues(bytes);
    expect(decodeBase64(encodeBase64(bytes))).toEqual(bytes);
  });
});

describe("identity (RSA-OAEP + PBKDF2 + AES-GCM private key wrap)", () => {
  it("SPKI round-trip: imported public key works for RSA-OAEP encrypt", async () => {
    const { importRsaOaepPublicKey } = await import("@/lib/crypto/identity");
    const { publicKey } = await generateIdentityKeyPair(subtle);
    const spki = await exportPublicKeySpkiBase64(publicKey);
    const imported = await importRsaOaepPublicKey(spki, subtle);
    const msg = new TextEncoder().encode("spki-check");
    const enc = await subtle.encrypt({ name: "RSA-OAEP" }, imported, msg);
    expect(enc.byteLength).toBeGreaterThan(0);
  });

  it("wraps and unwraps PKCS#8 and preserves decrypt capability", async () => {
    const password = "correct horse battery staple!";
    const salt = generatePbkdf2Salt();
    const { publicKey, privateKey } = await generateIdentityKeyPair(subtle);

    const wrapped = await wrapPrivateKeyPkcs8(privateKey, password, salt, subtle);
    const unwrapped = await unwrapPrivateKeyPkcs8(wrapped, password, salt, subtle);

    const msg = new TextEncoder().encode("hello oberyn");
    const enc = await subtle.encrypt({ name: "RSA-OAEP" }, publicKey, msg);
    const dec = await subtle.decrypt({ name: "RSA-OAEP" }, unwrapped, enc);
    expect(new TextDecoder().decode(dec)).toBe("hello oberyn");
  });

  it("fails unwrap with wrong password", async () => {
    const salt = generatePbkdf2Salt();
    const { privateKey } = await generateIdentityKeyPair(subtle);
    const wrapped = await wrapPrivateKeyPkcs8(privateKey, "good-password", salt, subtle);
    let threw = false;
    try {
      await unwrapPrivateKeyPkcs8(wrapped, "wrong-password", salt, subtle);
    } catch {
      threw = true;
    }
    expect(threw).toBe(true);
  });
});

describe("envelope (AES-GCM + RSA-OAEP)", () => {
  it("encrypts for recipient and self; both decrypt", async () => {
    const alice = await generateIdentityKeyPair(subtle);
    const bob = await generateIdentityKeyPair(subtle);

    const alicePubB64 = await exportPublicKeySpkiBase64(alice.publicKey);
    const bobPubB64 = await exportPublicKeySpkiBase64(bob.publicKey);

    const secretMessage = "Quantum-resistant someday.";

    const payload = await encryptEnvelope(
      {
        plaintext: secretMessage,
        recipientPublicKeySpkiBase64: bobPubB64,
        senderPublicKeySpkiBase64: alicePubB64,
      },
      subtle,
    );

    const bobPlain = await decryptEnvelope(
      { payload, useSelfCopy: false, privateKey: bob.privateKey },
      subtle,
    );
    expect(bobPlain).toBe(secretMessage);

    const alicePlain = await decryptEnvelope(
      { payload, useSelfCopy: true, privateKey: alice.privateKey },
      subtle,
    );
    expect(alicePlain).toBe(secretMessage);
  });
});
