import type { MessageResponse } from "@/types/whisperbox-api";

/**
 * REST returns each page newest-first; pages are fetched newest→older.
 * Flatten to chronological order (oldest → newest) for display.
 */
export function flattenConversationPages(pages: MessageResponse[][]): MessageResponse[] {
  return [...pages].reverse().flatMap((page) => [...page].reverse());
}
