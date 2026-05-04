"use client";

import { useCallback, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { decryptEnvelope, encryptEnvelope } from "@/lib/crypto/envelope";
import {
  exportPublicKeySpkiBase64,
  generateIdentityKeyPair,
  generatePbkdf2Salt,
  importRsaOaepPublicKey,
  unwrapPrivateKeyPkcs8,
  wrapPrivateKeyPkcs8,
} from "@/lib/crypto/identity";
import { cn } from "@/lib/utils";

type LogLine = { ok: boolean; text: string };

export function CryptoVerificationClient() {
  const [log, setLog] = useState<LogLine[]>([]);
  const [running, setRunning] = useState<"idle" | "identity" | "envelope" | "both">("idle");

  const append = useCallback((lines: LogLine[]) => {
    setLog((prev) => [...prev, ...lines]);
  }, []);

  const runIdentity = useCallback(async () => {
    const subtle = crypto.subtle;
    const password = "dev-verification-password";
    const salt = generatePbkdf2Salt();
    const { publicKey, privateKey } = await generateIdentityKeyPair(subtle);
    const wrapped = await wrapPrivateKeyPkcs8(privateKey, password, salt, subtle);
    const unwrapped = await unwrapPrivateKeyPkcs8(wrapped, password, salt, subtle);
    const pub = await importRsaOaepPublicKey(await exportPublicKeySpkiBase64(publicKey), subtle);
    const msg = new TextEncoder().encode("round-trip");
    const ct = await subtle.encrypt({ name: "RSA-OAEP" }, pub, msg);
    const pt = await subtle.decrypt({ name: "RSA-OAEP" }, unwrapped, ct);
    const out = new TextDecoder().decode(pt);
    if (out !== "round-trip") {
      return [{ ok: false, text: `RSA path mismatch: got ${out}` }];
    }
    return [
      {
        ok: true,
        text: "Identity: generate → PBKDF2+AES-GCM wrap (PKCS#8) → unwrap → RSA encrypt/decrypt OK.",
      },
    ];
  }, []);

  const runEnvelope = useCallback(async () => {
    const subtle = crypto.subtle;
    const alice = await generateIdentityKeyPair(subtle);
    const bob = await generateIdentityKeyPair(subtle);
    const alicePub = await exportPublicKeySpkiBase64(alice.publicKey);
    const bobPub = await exportPublicKeySpkiBase64(bob.publicKey);
    const plaintext = "hello from dev crypto page";
    const payload = await encryptEnvelope(
      {
        plaintext,
        recipientPublicKeySpkiBase64: bobPub,
        senderPublicKeySpkiBase64: alicePub,
      },
      subtle,
    );
    const bobReads = await decryptEnvelope(
      { payload, useSelfCopy: false, privateKey: bob.privateKey },
      subtle,
    );
    const aliceReads = await decryptEnvelope(
      { payload, useSelfCopy: true, privateKey: alice.privateKey },
      subtle,
    );
    if (bobReads !== plaintext || aliceReads !== plaintext) {
      return [{ ok: false, text: "Envelope plaintext mismatch after decrypt." }];
    }
    return [
      {
        ok: true,
        text: "Envelope: AES-GCM + RSA-OAEP (recipient + self) round-trip OK.",
      },
    ];
  }, []);

  const handleBoth = useCallback(async () => {
    setRunning("both");
    append([{ ok: true, text: "--- run ---" }]);
    try {
      append(await runIdentity());
      append(await runEnvelope());
    } catch (e) {
      append([
        {
          ok: false,
          text: e instanceof Error ? e.message : String(e),
        },
      ]);
    } finally {
      setRunning("idle");
    }
  }, [append, runEnvelope, runIdentity]);

  return (
    <div className="font-oberyn-body mx-auto max-w-2xl space-y-6 p-6 text-neutral-900">
      <div>
        <p className="text-sm text-neutral-600">
          <Link href="/" className="font-medium text-[#ff6b1a] underline">
            ← Home
          </Link>
        </p>
        <h1 className="font-oberyn-display mt-2 text-2xl">Crypto verification (dev)</h1>
        <p className="mt-2 text-sm text-neutral-700">
          Runs Web Crypto in the browser: PBKDF2 → AES-GCM (wrapped PKCS#8), RSA-OAEP, message envelope.
          Use{" "}
          <code className="rounded bg-neutral-200 px-1">pnpm test</code> for Node unit tests.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          disabled={running !== "idle"}
          onClick={async () => {
            setRunning("identity");
            append([{ ok: true, text: "--- identity ---" }]);
            try {
              append(await runIdentity());
            } catch (e) {
              append([
                { ok: false, text: e instanceof Error ? e.message : String(e) },
              ]);
            } finally {
              setRunning("idle");
            }
          }}
          className={cn(
            "font-oberyn-display border-2 border-black bg-[#ff6b1a] uppercase tracking-wide text-white",
          )}
        >
          Run identity
        </Button>
        <Button
          type="button"
          disabled={running !== "idle"}
          onClick={async () => {
            setRunning("envelope");
            append([{ ok: true, text: "--- envelope ---" }]);
            try {
              append(await runEnvelope());
            } catch (e) {
              append([
                { ok: false, text: e instanceof Error ? e.message : String(e) },
              ]);
            } finally {
              setRunning("idle");
            }
          }}
          className={cn(
            "font-oberyn-display border-2 border-black bg-neutral-800 uppercase tracking-wide text-white",
          )}
        >
          Run envelope
        </Button>
        <Button
          type="button"
          disabled={running !== "idle"}
          onClick={handleBoth}
          variant="outline"
          className="font-oberyn-display border-2 border-black uppercase tracking-wide"
        >
          Run both
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => setLog([])}
          className="text-sm"
        >
          Clear log
        </Button>
      </div>

      <pre
        className="min-h-[8rem] overflow-x-auto rounded-lg border-2 border-black bg-[#FDF6E3] p-4 text-xs leading-relaxed"
        role="log"
      >
        {log.length === 0 ? (
          <span className="text-neutral-500">No runs yet.</span>
        ) : (
          log.map((line, i) => (
            <div key={`${i}-${line.text}`} className={line.ok ? "text-neutral-900" : "text-red-700"}>
              {line.text}
            </div>
          ))
        )}
      </pre>
    </div>
  );
}
