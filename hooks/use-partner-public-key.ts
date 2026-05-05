"use client";

import { useQuery } from "@tanstack/react-query";

import { getUserPublicKeyWhisperbox } from "@/lib/api/whisperbox-api";
import { queryKeys } from "@/lib/query-keys";

export function usePartnerPublicKey(partnerUserId: string | null, accessToken: string | null) {
  return useQuery({
    queryKey: partnerUserId ? queryKeys.publicKey(partnerUserId) : ["public-key", "none"],
    queryFn: () => getUserPublicKeyWhisperbox(partnerUserId!, accessToken!),
    enabled: Boolean(partnerUserId && accessToken),
    staleTime: 300_000,
  });
}
