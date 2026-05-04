"use client";

import Image from "next/image";
import { startTransition, useCallback, useState } from "react";

import { cn } from "@/lib/utils";

/** Slower, softer ease — less “snap” on hover. */
const easeSoft = "ease-[cubic-bezier(0.33,1,0.32,1)]";
const durationLayer = "duration-[580ms]";
const durationDot = "duration-[480ms]";

type LayerKey = "identity" | "wrapped" | "messages" | "transport" | "trust";

const LAYER_COPY: Record<
  LayerKey,
  { label: string; title: string; description: string }
> = {
  identity: {
    label: "RSA",
    title: "Identity keys",
    description:
      "RSA-OAEP keypair on your device. The server stores your public key; your private key is never sent in plaintext.",
  },
  wrapped: {
    label: "Wrap",
    title: "Wrapped at rest",
    description:
      "Your private key is wrapped with AES-KW using a key derived from your password (PBKDF2) — unlock happens only in memory here.",
  },
  messages: {
    label: "AES-GCM",
    title: "Message bodies",
    description:
      "Each message uses a fresh AES-GCM key. The server forwards ciphertext — it never sees your plaintext.",
  },
  transport: {
    label: "TLS",
    title: "Wire encryption",
    description:
      "HTTPS protects bytes in transit. E2EE means even the relay cannot read your message content.",
  },
  trust: {
    label: "TOFU",
    title: "Public keys",
    description:
      "You encrypt to the public key the server returns — verify out-of-band if you need stronger trust than first fetch.",
  },
};

const cardMotion = cn(
  "transform-gpu backface-hidden will-change-transform cursor-pointer",
  durationLayer,
  easeSoft,
  "transition-[transform,box-shadow]",
  "motion-reduce:!transition-none motion-reduce:hover:!translate-y-0 motion-reduce:focus-visible:!translate-y-0 motion-reduce:hover:!shadow-[4px_4px_0_0_#000] motion-reduce:focus-visible:!shadow-[4px_4px_0_0_#000]",
);

const dotMotion = cn(
  "transform-gpu backface-hidden will-change-transform cursor-pointer",
  durationDot,
  easeSoft,
  "transition-[transform,box-shadow]",
  "motion-reduce:!transition-none motion-reduce:hover:!scale-100 motion-reduce:focus-visible:!scale-100",
);

export function HeroAsideVisual() {
  const [active, setActive] = useState<LayerKey | null>(null);

  const pick = useCallback((key: LayerKey) => {
    startTransition(() => setActive(key));
  }, []);

  const clearIfLeavingWidget = useCallback((e: React.FocusEvent<HTMLDivElement>) => {
    const next = e.relatedTarget as Node | null;
    if (next && e.currentTarget.contains(next)) return;
    startTransition(() => setActive(null));
  }, []);

  const onLayerKeyDown = useCallback(
    (key: LayerKey) => (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        pick(key);
      }
    },
    [pick],
  );

  return (
    <div
      className="relative mx-auto w-full max-w-md font-oberyn-body lg:max-w-none"
      onMouseLeave={() => startTransition(() => setActive(null))}
      onBlur={clearIfLeavingWidget}
    >
      <div
        className="relative isolate mx-auto h-[220px] w-full max-w-[320px] sm:h-[260px] sm:max-w-[360px]"
        role="presentation"
      >
        {/* Back — identity */}
        <div
          role="button"
          tabIndex={0}
          aria-pressed={active === "identity"}
          aria-label={`${LAYER_COPY.identity.title}: ${LAYER_COPY.identity.description}`}
          onMouseEnter={() => pick("identity")}
          onFocus={() => pick("identity")}
          onKeyDown={onLayerKeyDown("identity")}
          className={cn(
            "absolute bottom-0 left-[-2%] z-10 flex h-[58%] w-[74%] flex-col rounded-2xl border-2 border-black bg-white p-2 pb-2 shadow-[4px_4px_0_0_#000] pointer-events-auto outline-none",
            cardMotion,
            "hover:z-[100] hover:-translate-y-1.5 hover:shadow-[7px_7px_0_0_#000]",
            "focus-visible:z-[100] focus-visible:-translate-y-1.5 focus-visible:shadow-[7px_7px_0_0_#000]",
            "focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2",
          )}
        >
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-1 pt-1">
            <Image
              src="/landing/layer-identity.svg"
              alt=""
              width={72}
              height={72}
              draggable={false}
              unoptimized
              className="h-14 w-14 object-contain select-none sm:h-16 sm:w-16"
            />
          </div>
          <span className="font-oberyn-display shrink-0 text-center text-xs uppercase tracking-wide text-neutral-600">
            {LAYER_COPY.identity.label}
          </span>
        </div>

        {/* Mid — wrapped */}
        <div
          role="button"
          tabIndex={0}
          aria-pressed={active === "wrapped"}
          aria-label={`${LAYER_COPY.wrapped.title}: ${LAYER_COPY.wrapped.description}`}
          onMouseEnter={() => pick("wrapped")}
          onFocus={() => pick("wrapped")}
          onKeyDown={onLayerKeyDown("wrapped")}
          className={cn(
            "absolute bottom-[12%] left-[14%] z-20 flex h-[58%] w-[72%] flex-col rounded-2xl border-2 border-black bg-[#ffe8dc] p-2 pb-2 shadow-[4px_4px_0_0_#000] pointer-events-auto outline-none",
            cardMotion,
            "hover:z-[100] hover:-translate-y-2 hover:shadow-[7px_7px_0_0_#000]",
            "focus-visible:z-[100] focus-visible:-translate-y-2 focus-visible:shadow-[7px_7px_0_0_#000]",
            "focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2",
          )}
        >
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-1 pt-1">
            <Image
              src="/landing/layer-wrapped.svg"
              alt=""
              width={72}
              height={72}
              draggable={false}
              unoptimized
              className="h-14 w-14 object-contain select-none sm:h-16 sm:w-16"
            />
          </div>
          <span className="font-oberyn-display shrink-0 text-center text-xs uppercase tracking-wide text-neutral-700">
            {LAYER_COPY.wrapped.label}
          </span>
        </div>

        {/* Front — messages */}
        <div
          role="button"
          tabIndex={0}
          aria-pressed={active === "messages"}
          aria-label={`${LAYER_COPY.messages.title}: ${LAYER_COPY.messages.description}`}
          onMouseEnter={() => pick("messages")}
          onFocus={() => pick("messages")}
          onKeyDown={onLayerKeyDown("messages")}
          className={cn(
            "absolute bottom-[28%] left-[28%] z-30 flex h-[60%] w-[72%] flex-col rounded-2xl border-2 border-black bg-[#ff6b1a] px-2 pb-2 pt-2 shadow-[4px_4px_0_0_#000] pointer-events-auto outline-none",
            cardMotion,
            "hover:z-[100] hover:-translate-y-2.5 hover:shadow-[9px_9px_0_0_#000]",
            "focus-visible:z-[100] focus-visible:-translate-y-2.5 focus-visible:shadow-[9px_9px_0_0_#000]",
            "focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#ff6b1a]",
          )}
        >
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-1">
            <Image
              src="/landing/layer-messages.svg"
              alt=""
              width={72}
              height={72}
              draggable={false}
              unoptimized
              className="h-12 w-12 object-contain select-none opacity-95 sm:h-14 sm:w-14"
            />
            <span className="font-oberyn-display text-xl text-white drop-shadow-sm sm:text-2xl">E2EE</span>
          </div>
          <span className="font-oberyn-display shrink-0 text-center text-[10px] uppercase tracking-wide text-white/90">
            {LAYER_COPY.messages.label}
          </span>
        </div>

        {/* Accent — transport */}
        <div
          role="button"
          tabIndex={0}
          aria-pressed={active === "transport"}
          aria-label={`${LAYER_COPY.transport.title}: ${LAYER_COPY.transport.description}`}
          onMouseEnter={() => pick("transport")}
          onFocus={() => pick("transport")}
          onKeyDown={onLayerKeyDown("transport")}
          className={cn(
            "absolute -right-1 -top-2 z-40 flex h-11 w-11 items-center justify-center rounded-full border-2 border-black bg-[#7dd3fc] shadow-[3px_3px_0_0_#000] pointer-events-auto outline-none",
            dotMotion,
            "hover:z-[110] hover:scale-[1.06] hover:shadow-[5px_5px_0_0_#000]",
            "focus-visible:z-[110] focus-visible:scale-[1.06] focus-visible:shadow-[5px_5px_0_0_#000]",
            "focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2",
          )}
        >
          <Image
            src="/landing/dot-transport.svg"
            alt=""
            width={40}
            height={40}
            draggable={false}
            unoptimized
            className="pointer-events-none h-9 w-9 object-contain select-none"
          />
        </div>

        {/* Accent — trust */}
        <div
          role="button"
          tabIndex={0}
          aria-pressed={active === "trust"}
          aria-label={`${LAYER_COPY.trust.title}: ${LAYER_COPY.trust.description}`}
          onMouseEnter={() => pick("trust")}
          onFocus={() => pick("trust")}
          onKeyDown={onLayerKeyDown("trust")}
          className={cn(
            "absolute -bottom-1 left-[8%] z-40 flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-[#f9a8d4] shadow-[3px_3px_0_0_#000] pointer-events-auto outline-none",
            dotMotion,
            "hover:z-[110] hover:scale-[1.06] hover:shadow-[5px_5px_0_0_#000]",
            "focus-visible:z-[110] focus-visible:scale-[1.06] focus-visible:shadow-[5px_5px_0_0_#000]",
            "focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2",
          )}
        >
          <Image
            src="/landing/dot-trust.svg"
            alt=""
            width={32}
            height={32}
            draggable={false}
            unoptimized
            className="pointer-events-none h-7 w-7 object-contain select-none"
          />
        </div>
      </div>

      <p
        role="status"
        aria-live="polite"
        className={cn(
          "font-oberyn-body mt-5 min-h-[4.5rem] max-w-md px-1 text-center text-sm leading-snug text-neutral-900 transition-opacity duration-300 ease-out sm:min-h-[4rem] sm:text-base",
          "motion-reduce:transition-none",
        )}
      >
        {active === null ? (
          <>
            <span className="font-medium text-black">Explore the stack.</span>{" "}
            <span className="text-neutral-700">
              Hover or focus each shape — three layers for crypto, two dots for the wire and trust model.
            </span>
          </>
        ) : (
          <>
            <span className="font-oberyn-display text-black">{LAYER_COPY[active].title}</span>
            {" — "}
            <span className="text-neutral-800">{LAYER_COPY[active].description}</span>
          </>
        )}
      </p>
    </div>
  );
}
