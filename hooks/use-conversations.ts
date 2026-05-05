"use client";

import { useQuery } from "@tanstack/react-query";

import { listConversationsWhisperbox } from "@/lib/api/whisperbox-api";
import { queryKeys } from "@/lib/query-keys";

export function useConversations(accessToken: string | null) {
  return useQuery({
    queryKey: queryKeys.conversations,
    queryFn: () => listConversationsWhisperbox(accessToken!),
    enabled: Boolean(accessToken),
  });
}
