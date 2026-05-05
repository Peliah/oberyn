export const queryKeys = {
  health: ["api", "health"] as const,
  session: ["auth", "session"] as const,
  me: () => ["auth", "me"] as const,
  conversations: ["conversations"] as const,
  conversationMessages: (userId: string) => ["conversations", userId, "messages"] as const,
  userSearch: (q: string) => ["users", "search", q] as const,
  publicKey: (userId: string) => ["users", userId, "public-key"] as const,
};
