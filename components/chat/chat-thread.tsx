"use client";

import { useEffect, useMemo, useRef } from "react";

import { DateSeparator } from "@/components/chat/date-separator";
import { MessageBubble } from "@/components/chat/message-bubble";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { initialsFromDisplayName } from "@/lib/chat/initials";
import { flattenConversationPages } from "@/lib/chat/flatten-messages";
import { useDecryptedBodies } from "@/hooks/use-decrypted-messages";
import { cn } from "@/lib/utils";
import type { MessageResponse } from "@/types/whisperbox-api";

function sameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

type ChatThreadProps = {
  partnerLabel: string;
  partnerUsername: string | null;
  myUserId: string;
  privateKey: CryptoKey | null;
  messagePages: MessageResponse[][] | undefined;
  fetchNextPage: () => Promise<unknown>;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
};

export function ChatThread({
  partnerLabel,
  partnerUsername,
  myUserId,
  privateKey,
  messagePages,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
}: ChatThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  const chronological = useMemo(
    () => flattenConversationPages(messagePages ?? []),
    [messagePages],
  );

  const bodies = useDecryptedBodies(chronological, myUserId, privateKey);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [chronological.length]);

  const initials = initialsFromDisplayName(partnerLabel);

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#fffef8]">
      <header className="relative z-[1] flex items-stretch gap-0 border-b-2 border-black bg-gradient-to-b from-[#fff9ed] to-[#FDF6E3]">
        <div
          className="w-1.5 shrink-0 bg-[#ff6b1a] shadow-[2px_0_0_0_rgba(0,0,0,0.25)]"
          aria-hidden
        />
        <div className="flex min-w-0 flex-1 items-center gap-3 px-3 py-3.5 sm:px-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-black bg-[#7dd3fc]/35 font-mono text-sm font-semibold uppercase tracking-tight text-neutral-900 shadow-[3px_3px_0_0_#000] sm:size-14 sm:text-base">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <h2 className="font-oberyn-display text-lg tracking-wide text-neutral-950 sm:text-xl">{partnerLabel}</h2>
              <span className="rounded-none border border-black/70 bg-white/90 px-1.5 py-px font-mono text-[9px] uppercase tracking-widest text-neutral-700 shadow-[1px_1px_0_0_rgba(0,0,0,0.55)]">
                Direct
              </span>
            </div>
            {partnerUsername ? (
              <p className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground">@{partnerUsername}</p>
            ) : null}
            <p className="mt-1 font-mono text-[9px] leading-snug text-muted-foreground/90">
              Messages are encrypted on this device before they leave the browser.
            </p>
          </div>
        </div>
      </header>

      <ScrollArea className="relative z-[1] min-h-0 flex-1">
        <div className="relative">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.45]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.065) 1px, transparent 0)`,
              backgroundSize: "18px 18px",
            }}
            aria-hidden
          />
          <div className="relative flex flex-col px-3 py-5 sm:px-5">
          {hasNextPage ? (
            <div className="mb-4 flex justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-2 border-black font-mono text-[10px] uppercase shadow-[3px_3px_0_0_#000]"
                disabled={isFetchingNextPage}
                onClick={() => void fetchNextPage()}
              >
                {isFetchingNextPage ? (
                  <span className="inline-flex items-center gap-2">
                    <Spinner className="size-3" />
                    Loading older…
                  </span>
                ) : (
                  "Load older messages"
                )}
              </Button>
            </div>
          ) : null}

          {isLoading ? (
            <div className="flex items-center gap-2 py-10 font-mono text-[10px] text-muted-foreground">
              <Spinner className="size-3" />
              Loading messages…
            </div>
          ) : chronological.length === 0 ? (
            <p className="py-10 text-center font-mono text-[10px] text-muted-foreground">
              No messages yet. Say hello — it stays between you two.
            </p>
          ) : (
            chronological.map((m, i) => {
              const prev = i > 0 ? chronological[i - 1] : null;
              const curDate = new Date(m.created_at);
              const prevDate = prev ? new Date(prev.created_at) : null;
              const showDate = !prevDate || !sameCalendarDay(curDate, prevDate);

              const mine = m.from_user_id === myUserId;
              const text = bodies[m.id] ?? (privateKey ? "Decrypting…" : "Unlock session to read");

              return (
                <div key={m.id} className={cn(i > 0 && !showDate && "mt-2")}>
                  {showDate ? <DateSeparator date={curDate} /> : null}
                  <MessageBubble text={text} mine={mine} />
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
