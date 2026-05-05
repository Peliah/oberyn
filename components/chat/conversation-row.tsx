"use client";

import { formatDistanceToNow } from "date-fns";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { initialsFromDisplayName } from "@/lib/chat/initials";
import { cn } from "@/lib/utils";
import type { ConversationSummary } from "@/types/whisperbox-api";

type ConversationRowProps = {
  conversation: ConversationSummary;
  selected: boolean;
  onSelect: () => void;
};

export function ConversationRow({ conversation, selected, onSelect }: ConversationRowProps) {
  const { state, isMobile } = useSidebar();
  const rail = !isMobile && state === "collapsed";

  const activity =
    conversation.last_message_at != null
      ? formatDistanceToNow(new Date(conversation.last_message_at), { addSuffix: true })
      : "No activity yet";

  const label = initialsFromDisplayName(conversation.display_name);

  if (rail) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={onSelect}
            className={cn(
              "flex w-full justify-center py-1.5 transition-transform active:scale-95",
              selected && "relative",
            )}
            aria-current={selected ? "true" : undefined}
            aria-label={`Open conversation with ${conversation.display_name}`}
          >
            <span
              className={cn(
                "relative flex size-10 items-center justify-center rounded-full border-2 border-black font-mono text-[11px] font-semibold uppercase tracking-tight shadow-[2px_2px_0_0_#000] transition-colors",
                selected
                  ? "bg-[#ff6b1a] text-white ring-2 ring-black ring-offset-2 ring-offset-[#fefbf2]"
                  : "bg-white text-neutral-900 hover:bg-[#ff6b1a]/12",
              )}
            >
              {label.slice(0, 2)}
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-[14rem] border-2 border-black bg-[#fefbf2] font-mono text-[10px] shadow-[4px_4px_0_0_#000]">
          <p className="font-oberyn-display text-sm tracking-wide text-neutral-900">{conversation.display_name}</p>
          <p className="text-muted-foreground">@{conversation.username}</p>
          <p className="mt-1 text-muted-foreground">{activity}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group/row flex w-full gap-3 border-b-2 border-black/80 px-2.5 py-2.5 text-left transition-colors",
        selected
          ? "bg-gradient-to-r from-[#ff6b1a]/20 to-transparent"
          : "bg-transparent hover:bg-black/[0.04]",
      )}
    >
      <Avatar size="sm" className="mt-0.5 border-2 border-black shadow-[2px_2px_0_0_#000]">
        <AvatarFallback
          className={cn(
            "rounded-full bg-[#7dd3fc]/40 font-mono text-[10px] font-semibold text-neutral-900",
            selected && "bg-[#ff6b1a]/30",
          )}
        >
          {label}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate font-oberyn-display text-sm font-normal tracking-wide text-neutral-900">
            {conversation.display_name}
          </span>
          <span
            className="shrink-0 font-mono text-[9px] tabular-nums text-muted-foreground"
            title={activity}
          >
            {conversation.last_message_at
              ? formatDistanceToNow(new Date(conversation.last_message_at), { addSuffix: true })
              : "—"}
          </span>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">@{conversation.username}</span>
      </div>
    </button>
  );
}
