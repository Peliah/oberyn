"use client";

import { ChatCircle, LockKey } from "@phosphor-icons/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { ChatLayout } from "@/components/chat/chat-layout";
import { ChatLoading } from "@/components/chat/chat-loading";
import {
  ChatHeaderTrailingHome,
  ChatSidebarAccountFooter,
  ChatSidebarBrand,
  ChatSidebarSearch,
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
      <div className="flex min-h-[50vh] items-center justify-center bg-[#e8e6e1] px-4 font-mono text-xs text-neutral-700">
        Redirecting…
      </div>
    );
  }

  const selectPartner = (userId: string) => {
    router.push(`/chat?with=${encodeURIComponent(userId)}`);
  };

  const welcomeFirst = user.display_name.trim().split(/\s+/)[0] ?? user.display_name;

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
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <div className="flex max-w-md flex-col items-center gap-6">
          <div className="flex size-16 items-center justify-center rounded-md border-2 border-black bg-[#ff6b1a] shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            <ChatCircle className="size-9 text-white" weight="fill" aria-hidden />
          </div>
          <div>
            <h1 className="font-oberyn-display text-2xl font-normal uppercase tracking-wide text-black sm:text-3xl">
              Welcome, {welcomeFirst}
            </h1>
            <p className="mt-3 font-mono text-sm leading-relaxed text-neutral-600">
              Pick a conversation on the left, or search for someone to start a new encrypted thread.
            </p>
          </div>
          <p className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-[#ff6b1a] px-4 py-2 font-mono text-[10px] font-medium uppercase tracking-wide text-white shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
            <LockKey className="size-3.5 shrink-0" weight="bold" aria-hidden />
            Your private key stays on this device only
          </p>
        </div>
      </div>
    );

  return (
    <ChatLayout
      sidebarHeader={
        <>
          <ChatSidebarBrand />
          <ChatSidebarSearch
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
        </>
      }
      sidebarFooter={
        <ChatSidebarAccountFooter
          displayName={user.display_name}
          username={user.username}
          onSignOut={() => void signOut()}
        />
      }
      headerTrailing={<ChatHeaderTrailingHome />}
      sidebarBody={
        <ConversationListGroups
          conversations={conversations}
          conversationsLoading={convLoading}
          selectedUserId={partnerId}
          onSelectConversation={selectPartner}
        />
      }
      main={main}
    />
  );
}
