"use client";

import { HouseIcon, SignOutIcon } from "@phosphor-icons/react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { OberynWordmark } from "@/components/brand/oberyn-wordmark";
import { UserSearchField } from "@/components/chat/user-search-field";
import { initialsFromDisplayName } from "@/lib/chat/initials";
import type { UserPublicInfo } from "@/types/whisperbox-api";

const APP_NAME = "Oberyn";

export function ChatSidebarBrand() {
  const { state, isMobile } = useSidebar();
  const collapsed = !isMobile && state === "collapsed";

  if (collapsed) {
    return (
      <div className="flex w-full justify-center py-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarMenuButton asChild className="size-10! justify-center p-0 font-oberyn-display text-xl leading-none tracking-wide">
              <Link href="/" aria-label={`${APP_NAME} — home`}>
                O
              </Link>
            </SidebarMenuButton>
          </TooltipTrigger>
          <TooltipContent side="right">{APP_NAME}</TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="mb-4 flex items-center justify-between gap-2">
      {/* <Link href="/" className="min-w-0 max-w-[min(100%,11rem)] shrink hover:opacity-90"> */}
        <OberynWordmark className="w-auto" />
      {/* </Link> */}
      {/* <span className="shrink-0 rounded-full border-2 border-black bg-[#ff6b1a] px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-white">
        E2EE
      </span> */}
    </div>
  );
}

type ChatSidebarAccountFooterProps = {
  displayName: string;
  username: string;
  onSignOut: () => void;
};

export function ChatSidebarAccountFooter({
  displayName,
  username,
  onSignOut,
}: ChatSidebarAccountFooterProps) {
  const { state, isMobile } = useSidebar();
  const collapsed = !isMobile && state === "collapsed";
  const initial = initialsFromDisplayName(displayName).slice(0, 1);

  if (collapsed) {
    return (
      <div className="flex w-full justify-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarMenuButton
              type="button"
              className="size-9! justify-center p-0"
              onClick={() => void onSignOut()}
              aria-label="Sign out"
            >
              <SignOutIcon className="size-4 shrink-0" weight="bold" />
            </SidebarMenuButton>
          </TooltipTrigger>
          <TooltipContent side="right">Sign out</TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-md border-2 border-black bg-[#ff6b1a] font-mono text-sm font-bold text-white"
        aria-hidden
      >
        {initial}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-oberyn-display text-sm tracking-wide text-neutral-900">{displayName}</p>
        <p className="truncate font-mono text-[11px] text-muted-foreground">@{username}</p>
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-9 shrink-0 border-2 border-transparent hover:border-black hover:bg-neutral-50"
            onClick={() => void onSignOut()}
            aria-label="Sign out"
          >
            <SignOutIcon className="size-4" weight="bold" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Sign out</TooltipContent>
      </Tooltip>
    </div>
  );
}

export function ChatHeaderTrailingHome() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          asChild
          size="icon-sm"
          variant="outline"
          className="size-9 shrink-0 border-2 border-black bg-white text-foreground shadow-[2px_2px_0_0_#000] hover:bg-neutral-100"
        >
          <Link href="/" aria-label="Home">
            <HouseIcon className="size-4" weight="bold" />
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">Home</TooltipContent>
    </Tooltip>
  );
}

export type ChatSidebarSearchProps = {
  query: string;
  onQueryChange: (q: string) => void;
  results: UserPublicInfo[] | undefined;
  isLoading: boolean;
  onPickUser: (u: UserPublicInfo) => void;
  currentUserId: string | null;
};

export function ChatSidebarSearch({
  query,
  onQueryChange,
  results,
  isLoading,
  onPickUser,
  currentUserId,
}: ChatSidebarSearchProps) {
  return (
    <UserSearchField
      variant="sidebar"
      query={query}
      onQueryChange={onQueryChange}
      results={results}
      isLoading={isLoading}
      onPickUser={onPickUser}
      currentUserId={currentUserId}
    />
  );
}
