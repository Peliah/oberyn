"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { ChatLayout } from "@/components/chat/chat-layout";
import { ChatLoading } from "@/components/chat/chat-loading";
import {
  ChatHeaderSearch,
  ChatHeaderTrailingHome,
  ChatSidebarBrand,
  ChatSidebarSignOutFooter,
} from "@/components/chat/chat-sidebar-chrome";
import { ChatThread } from "@/components/chat/chat-thread";
import { ConversationListGroups } from "@/components/chat/conversation-list-groups";
import { MessageComposer } from "@/components/chat/message-composer";
import { useConversations } from "@/hooks/use-conversations";
import { useConversationMessages } from "@/hooks/use-messages";
import { usePartnerPublicKey } from "@/hooks/use-partner-public-key";
import { useUserSearch } from "@/hooks/use-user-search";
import { useWhisperboxSocket } from "@/hooks/use-whisperbox-socket";
import { useSession } from "@/lib/session/session-context";

export function ChatView() {
  const router = useRouter();
  const params = useSearchParams();
  const partnerId = params.get("with");

  const { accessToken, user, privateKey, signOut, sessionRestored } = useSession();
  const { send, ready } = useWhisperboxSocket(accessToken);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!sessionRestored) return;
    if (!accessToken) {
      router.replace("/");
    }
  }, [sessionRestored, accessToken, router]);

  const { data: conversations, isLoading: convLoading } = useConversations(accessToken);
  const { data: searchResults, isLoading: searchLoading } = useUserSearch(searchQuery, accessToken);

  const messagesQuery = useConversationMessages(partnerId, accessToken);
  const { data: partnerKey } = usePartnerPublicKey(partnerId, accessToken);

  const partnerMeta = useMemo(() => {
    if (!partnerId) return null;
    const fromConv = conversations?.find((c) => c.user_id === partnerId);
    if (fromConv) {
      return { label: fromConv.display_name, username: fromConv.username };
    }
    return { label: "Conversation", username: null as string | null };
  }, [conversations, partnerId]);

  if (!sessionRestored) {
    return <ChatLoading />;
  }

  if (!accessToken || !user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-[#ff6b1a] px-4 font-mono text-xs text-white">
        Redirecting…
      </div>
    );
  }

  const selectPartner = (userId: string) => {
    router.push(`/chat?with=${encodeURIComponent(userId)}`);
  };

  const main =
    partnerId && partnerMeta ? (
      <div className="flex min-h-0 flex-1 flex-col">
        <ChatThread
          partnerLabel={partnerMeta.label}
          partnerUsername={partnerMeta.username}
          myUserId={user.id}
          privateKey={privateKey}
          messagePages={messagesQuery.data?.pages}
          fetchNextPage={messagesQuery.fetchNextPage}
          hasNextPage={messagesQuery.hasNextPage ?? false}
          isFetchingNextPage={messagesQuery.isFetchingNextPage}
          isLoading={messagesQuery.isLoading}
        />
        <MessageComposer
          partnerUserId={partnerId}
          accessToken={accessToken}
          senderPublicKeySpkiBase64={user.public_key}
          recipientPublicKeySpkiBase64={partnerKey?.public_key}
          wsSend={send}
          wsReady={ready}
        />
      </div>
    ) : (
      <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-16 text-center">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              135deg,
              transparent,
              transparent 12px,
              rgba(0,0,0,0.04) 12px,
              rgba(0,0,0,0.04) 13px
            )`,
          }}
          aria-hidden
        />
        <div className="relative max-w-lg rounded-sm border-2 border-black bg-[#FDF6E3]/95 px-8 py-10 shadow-[8px_8px_0_0_rgba(0,0,0,0.85)]">
          <p className="font-oberyn-display text-2xl tracking-wide text-neutral-900">Pick a thread</p>
          <p className="mt-4 font-mono text-[11px] leading-relaxed text-muted-foreground">
            Drag the rail grip or press{" "}
            <kbd className="rounded border border-black bg-white px-1.5 py-0.5 font-mono text-[10px]">⌘B</kbd>{" "}
            /{" "}
            <kbd className="rounded border border-black bg-white px-1.5 py-0.5 font-mono text-[10px]">Ctrl+B</kbd>
            . Recent chats sit in the sidebar index; use the search bar up top to open anyone new.
          </p>
        </div>
      </div>
    );

  return (
    <ChatLayout
      sidebarHeader={<ChatSidebarBrand />}
      sidebarFooter={<ChatSidebarSignOutFooter onSignOut={() => void signOut()} />}
      headerSearch={
        <ChatHeaderSearch
          query={searchQuery}
          onQueryChange={setSearchQuery}
          results={searchResults}
          isLoading={searchLoading}
          onPickUser={(u) => {
            selectPartner(u.id);
            setSearchQuery("");
          }}
          currentUserId={user.id}
        />
      }
      sidebarBody={
        <ConversationListGroups
          conversations={conversations}
          conversationsLoading={convLoading}
          selectedUserId={partnerId}
          onSelectConversation={selectPartner}
        />
      }
      insetHeader={
        <div className="flex min-w-0 flex-1 items-start gap-2 sm:gap-3">
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate font-mono text-[10px] text-muted-foreground">
              {user.display_name} · @{user.username}
            </span>
          </div>
          <div className="ml-auto flex shrink-0 flex-col items-end gap-1">
            <span className="rounded-none border border-black bg-white px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-800 shadow-[2px_2px_0_0_#000]">
              E2E
            </span>
            <span className="font-mono text-[9px] text-muted-foreground">Session unlocked</span>
          </div>
        </div>
      }
      headerTrailing={<ChatHeaderTrailingHome />}
      main={main}
    />
  );
}
