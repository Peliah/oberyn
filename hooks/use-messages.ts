"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { getConversationMessagesWhisperbox } from "@/lib/api/whisperbox-api";
import { queryKeys } from "@/lib/query-keys";

const PAGE_SIZE = 50;

export function useConversationMessages(partnerUserId: string | null, accessToken: string | null) {
  return useInfiniteQuery({
    queryKey: partnerUserId
      ? queryKeys.conversationMessages(partnerUserId)
      : ["messages", "none"],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      getConversationMessagesWhisperbox(partnerUserId!, accessToken!, {
        limit: PAGE_SIZE,
        before: pageParam ?? null,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage.length || lastPage.length < PAGE_SIZE) return undefined;
      const oldest = lastPage[lastPage.length - 1];
      return oldest?.created_at;
    },
    enabled: Boolean(partnerUserId && accessToken),
  });
}
