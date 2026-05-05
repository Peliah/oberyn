"use client";

import { MagnifyingGlass } from "@phosphor-icons/react";

import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import type { UserPublicInfo } from "@/types/whisperbox-api";

type UserSearchFieldProps = {
  query: string;
  onQueryChange: (q: string) => void;
  results: UserPublicInfo[] | undefined;
  isLoading: boolean;
  onPickUser: (user: UserPublicInfo) => void;
  currentUserId: string | null;
  /** Lighter chrome when embedded under the sidebar header. */
  embedded?: boolean;
  /** Top bar: compact wrap, results as overlay so the header does not jump. */
  variant?: "default" | "embedded" | "toolbar";
};

export function UserSearchField({
  query,
  onQueryChange,
  results,
  isLoading,
  onPickUser,
  currentUserId,
  embedded = false,
  variant = "default",
}: UserSearchFieldProps) {
  const trimmed = query.trim();
  const isToolbar = variant === "toolbar";
  const embeddedLike = embedded || isToolbar;

  return (
    <div
      className={cn(
        "p-2",
        embedded && !isToolbar && "rounded-none bg-transparent",
        !embeddedLike && "border-b-2 border-black",
        isToolbar && "relative z-[5] p-0",
      )}
    >
      <div className="relative">
        <MagnifyingGlass
          className={cn(
            "pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground",
            isToolbar && "left-2.5",
          )}
          aria-hidden
        />
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search people…"
          className={cn(
            "border-2 border-black pl-8 font-mono text-xs shadow-[2px_2px_0_0_rgba(0,0,0,0.85)]",
            embeddedLike && "bg-white",
            isToolbar && "h-9 pl-9 text-[13px]",
          )}
          aria-label="Search users"
        />
      </div>
      {trimmed.length > 0 && (
        <div
          className={cn(
            "border-2 border-black bg-white",
            isToolbar
              ? "absolute left-0 right-0 top-full z-[60] mt-1 max-h-48 overflow-y-auto shadow-[6px_6px_0_0_rgba(0,0,0,0.85)]"
              : "mt-2 max-h-40 overflow-y-auto",
          )}
        >
          {isLoading ? (
            <div className="flex items-center gap-2 px-2 py-3 font-mono text-[10px] text-muted-foreground">
              <Spinner className="size-3" />
              Searching…
            </div>
          ) : results && results.length === 0 ? (
            <p className="px-2 py-3 font-mono text-[10px] text-muted-foreground">No matches</p>
          ) : (
            <ul className="divide-y-2 divide-black">
              {results
                ?.filter((u) => u.id !== currentUserId)
                .map((u) => (
                  <li key={u.id}>
                    <button
                      type="button"
                      onClick={() => onPickUser(u)}
                      className={cn(
                        "flex w-full flex-col items-start gap-0.5 px-2 py-2 text-left",
                        "hover:bg-[#ff6b1a]/15",
                      )}
                    >
                      <span className="font-oberyn-display text-sm">{u.display_name}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">@{u.username}</span>
                    </button>
                  </li>
                ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
