"use client";

import { ChatsCircle } from "@phosphor-icons/react";
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
            ? "flex flex-col items-center gap-2 py-8"
            : "flex items-center justify-center gap-2 py-12 font-mono text-[11px] text-muted-foreground"
        }
      >
        <Spinner className="size-4 text-[#ff6b1a]" />
        {!rail ? <span>Loading…</span> : null}
      </div>
    );
  }

  if (sorted.length === 0) {
    if (rail) {
      return (
        <div className="flex justify-center py-6">
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="flex size-10 items-center justify-center rounded-md border-2 border-dashed border-black/25 bg-neutral-50"
                aria-label="No conversations yet"
              >
                <ChatsCircle className="size-5 text-muted-foreground" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-[12rem] text-xs">
              Search the sidebar to start a thread.
            </TooltipContent>
          </Tooltip>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center px-4 py-14 text-center">
        <div
          className="mb-4 flex size-12 items-center justify-center rounded-md border-2 border-black bg-amber-100 shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
          aria-hidden
        >
          <ChatsCircle className="size-7 text-neutral-800" />
        </div>
        <p className="font-oberyn-display text-base tracking-wide text-neutral-900">No conversations yet</p>
        <p className="mt-2 max-w-[16rem] font-mono text-xs leading-relaxed text-muted-foreground">
          Search for someone above to start your first encrypted thread.
        </p>
      </div>
    );
  }

  return (
    <>
      <SidebarGroup className="py-0">
        <SidebarGroupLabel
          className={
            rail
              ? "sr-only"
              : "px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
          }
        >
          Recent
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
          <SidebarSeparator className="mx-3 my-1 bg-black/10" />
          <SidebarGroup className="py-0">
            <SidebarGroupLabel
              className={
                rail
                  ? "sr-only"
                  : "px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
              }
            >
              Earlier
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
