"use client";

import { ChatsCircle, Fire } from "@phosphor-icons/react";
import { useMemo } from "react";

import { ConversationRow } from "@/components/chat/conversation-row";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ConversationSummary } from "@/types/whisperbox-api";

const LATEST_COUNT = 5;

type ConversationListGroupsProps = {
  conversations: ConversationSummary[] | undefined;
  conversationsLoading: boolean;
  selectedUserId: string | null;
  onSelectConversation: (userId: string) => void;
};

export function ConversationListGroups({
  conversations,
  conversationsLoading,
  selectedUserId,
  onSelectConversation,
}: ConversationListGroupsProps) {
  const { state, isMobile } = useSidebar();
  const rail = !isMobile && state === "collapsed";

  const sorted = useMemo(() => {
    if (!conversations) return [];
    return [...conversations].sort((a, b) => {
      const ta = a.last_message_at ? new Date(a.last_message_at).getTime() : 0;
      const tb = b.last_message_at ? new Date(b.last_message_at).getTime() : 0;
      return tb - ta;
    });
  }, [conversations]);

  const latest = sorted.slice(0, LATEST_COUNT);
  const more = sorted.slice(LATEST_COUNT);

  if (conversationsLoading) {
    return (
      <div
        className={
          rail
            ? "flex flex-col items-center gap-2 py-6"
            : "flex items-center gap-2 px-4 py-8 font-mono text-[10px] text-muted-foreground"
        }
      >
        <Spinner className="size-3.5 text-[#ff6b1a]" />
        {!rail ? <span>Syncing conversations…</span> : null}
      </div>
    );
  }

  if (sorted.length === 0) {
    if (rail) {
      return (
        <div className="flex justify-center py-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="flex size-10 items-center justify-center rounded-full border-2 border-dashed border-black/35 bg-white/80"
                aria-label="No conversations yet"
              >
                <ChatsCircle className="size-5 text-muted-foreground" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-[12rem] border-2 border-black font-mono text-[10px]">
              No threads yet — use the search bar at the top to start.
            </TooltipContent>
          </Tooltip>
        </div>
      );
    }
    return (
      <div className="mx-3 my-6 rounded-lg border-2 border-dashed border-black/25 bg-white/60 px-3 py-5 text-center">
        <p className="font-oberyn-display text-sm tracking-wide text-neutral-800">No threads yet</p>
        <p className="mt-2 font-mono text-[10px] leading-relaxed text-muted-foreground">
          Use the search bar at the top to reach someone — payloads stay ciphertext end-to-end.
        </p>
      </div>
    );
  }

  return (
    <>
      <SidebarGroup className="py-1">
        <SidebarGroupLabel
          className={
            rail
              ? "sr-only"
              : "flex items-center gap-1.5 px-3 font-oberyn-display text-[11px] uppercase tracking-[0.2em] text-neutral-600"
          }
        >
          <Fire className="size-3.5 text-[#ff6b1a]" weight="fill" aria-hidden />
          Latest {latest.length}
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu className="gap-0">
            {latest.map((c) => (
              <SidebarMenuItem key={c.user_id} className="p-0">
                <ConversationRow
                  conversation={c}
                  selected={c.user_id === selectedUserId}
                  onSelect={() => onSelectConversation(c.user_id)}
                />
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {more.length > 0 ? (
        <>
          <SidebarSeparator className="mx-0 h-[2px] bg-black" />
          <SidebarGroup className="py-1">
            <SidebarGroupLabel
              className={
                rail
                  ? "sr-only"
                  : "px-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
              }
            >
              Earlier · {more.length}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0">
                {more.map((c) => (
                  <SidebarMenuItem key={c.user_id} className="p-0">
                    <ConversationRow
                      conversation={c}
                      selected={c.user_id === selectedUserId}
                      onSelect={() => onSelectConversation(c.user_id)}
                    />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </>
      ) : null}
    </>
  );
}
