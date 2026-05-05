"use client";

import { Suspense } from "react";

import { ChatLoading } from "@/components/chat/chat-loading";
import { ChatView } from "@/components/chat/chat-view";

export default function ChatPage() {
  return (
    <Suspense fallback={<ChatLoading />}>
      <ChatView />
    </Suspense>
  );
}
