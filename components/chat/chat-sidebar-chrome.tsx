"use client";

import { ArrowLeftIcon, HouseIcon, SignOutIcon } from "@phosphor-icons/react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserSearchField } from "@/components/chat/user-search-field";
import { cn } from "@/lib/utils";
import type { UserPublicInfo } from "@/types/whisperbox-api";

const APP_NAME = "Oberyn";

/** App mark + home link: full wordmark expanded, single “O” when the rail is collapsed. */
export function ChatSidebarBrand() {
  const { state, isMobile } = useSidebar();
  const collapsed = !isMobile && state === "collapsed";

  if (collapsed) {
    return (
      <div className="flex w-full justify-center px-0.5 py-1">
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
    <div className="flex flex-col gap-2 px-1">
      <Link
        href="/"
        className="font-oberyn-display text-xl leading-none tracking-wide text-neutral-950 underline-offset-4 hover:underline"
      >
        {APP_NAME}
      </Link>
      <Link
        href="/"
        className="inline-flex w-fit items-center gap-1 font-mono text-[10px] uppercase tracking-wide text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
      >
        <ArrowLeftIcon className="size-3.5 shrink-0" weight="bold" aria-hidden />
        Home
      </Link>
    </div>
  );
}

type ChatSidebarSignOutFooterProps = {
  onSignOut: () => void;
};

export function ChatSidebarSignOutFooter({ onSignOut }: ChatSidebarSignOutFooterProps) {
  const { state, isMobile } = useSidebar();
  const collapsed = !isMobile && state === "collapsed";

  if (collapsed) {
    return (
      <div className="flex w-full justify-center px-0.5">
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
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn(
        "w-full border-2 border-black bg-white font-mono text-[10px] uppercase tracking-wide",
        "shadow-[2px_2px_0_0_#000] hover:bg-[#ff6b1a]/10",
      )}
      onClick={() => void onSignOut()}
    >
      Sign out
    </Button>
  );
}

/** Home icon on the far right of the main top bar (quick exit while sidebar is collapsed). */
export function ChatHeaderTrailingHome() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          asChild
          size="icon-sm"
          variant="outline"
          className="size-9 shrink-0 border-2 border-black bg-white text-foreground shadow-[2px_2px_0_0_#000] hover:bg-[#ff6b1a]/12"
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

export type ChatHeaderSearchProps = {
  query: string;
  onQueryChange: (q: string) => void;
  results: UserPublicInfo[] | undefined;
  isLoading: boolean;
  onPickUser: (u: UserPublicInfo) => void;
  currentUserId: string | null;
};

export function ChatHeaderSearch({
  query,
  onQueryChange,
  results,
  isLoading,
  onPickUser,
  currentUserId,
}: ChatHeaderSearchProps) {
  return (
    <UserSearchField
      variant="toolbar"
      query={query}
      onQueryChange={onQueryChange}
      results={results}
      isLoading={isLoading}
      onPickUser={onPickUser}
      currentUserId={currentUserId}
    />
  );
}
