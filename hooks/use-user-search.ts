"use client";

import { useQuery } from "@tanstack/react-query";

import { searchUsersWhisperbox } from "@/lib/api/whisperbox-api";
import { queryKeys } from "@/lib/query-keys";

export function useUserSearch(q: string, accessToken: string | null) {
  const trimmed = q.trim();
  return useQuery({
    queryKey: queryKeys.userSearch(trimmed),
    queryFn: () => searchUsersWhisperbox(trimmed, accessToken!),
    enabled: Boolean(accessToken) && trimmed.length >= 1,
    staleTime: 30_000,
  });
}
