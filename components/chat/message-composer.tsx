"use client";

import { PaperPlaneRight } from "@phosphor-icons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { sendMessageWhisperbox } from "@/lib/api/whisperbox-api";
import { encryptEnvelope } from "@/lib/crypto/envelope";
import { queryKeys } from "@/lib/query-keys";
import type { EncryptedPayload } from "@/types/encrypted-payload";

type MessageComposerProps = {
  partnerUserId: string;
  accessToken: string;
  senderPublicKeySpkiBase64: string;
  recipientPublicKeySpkiBase64: string | undefined;
  wsSend: (toUserId: string, payload: EncryptedPayload) => boolean;
  wsReady: boolean;
};

export function MessageComposer({
  partnerUserId,
  accessToken,
  senderPublicKeySpkiBase64,
  recipientPublicKeySpkiBase64,
  wsSend,
  wsReady,
}: MessageComposerProps) {
  const qc = useQueryClient();
  const [text, setText] = useState("");

  const sendMutation = useMutation({
    mutationFn: async (plaintext: string) => {
      if (!recipientPublicKeySpkiBase64) {
        throw new Error("Recipient key not loaded");
      }
      const payload = await encryptEnvelope({
        plaintext,
        recipientPublicKeySpkiBase64,
        senderPublicKeySpkiBase64,
      });
      await sendMessageWhisperbox({ to: partnerUserId, payload }, accessToken);
      if (wsReady) {
        wsSend(partnerUserId, payload);
      }
    },
    onSuccess: async () => {
      setText("");
      await qc.invalidateQueries({ queryKey: queryKeys.conversations });
      await qc.invalidateQueries({ queryKey: queryKeys.conversationMessages(partnerUserId) });
    },
    onError: (e) => {
      toast.error(e instanceof Error ? e.message : "Could not send message");
    },
  });

  const disabled =
    !recipientPublicKeySpkiBase64 || sendMutation.isPending || !accessToken;

  const submit = () => {
    const t = text.trim();
    if (!t || disabled) return;
    sendMutation.mutate(t);
  };

  return (
    <div className="border-t-2 border-black bg-white p-3">
      <div className="flex gap-2">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            recipientPublicKeySpkiBase64 ? "Message…" : "Loading keys…"
          }
          disabled={disabled}
          rows={2}
          className="min-h-[4rem] flex-1 resize-none rounded-md border-2 border-black bg-[#fafaf8] font-mono text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
        />
        <Button
          type="button"
          size="icon"
          disabled={disabled || !text.trim()}
          onClick={() => submit()}
          className="shrink-0 rounded-md border-2 border-black bg-[#ff6b1a] text-white shadow-[2px_2px_0_0_#000] hover:bg-[#e85f12]"
          aria-label="Send message"
        >
          <PaperPlaneRight className="size-5" weight="bold" />
        </Button>
      </div>
    </div>
  );
}
