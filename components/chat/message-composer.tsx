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
    <div className="relative border-t-2 border-black bg-[linear-gradient(180deg,#fff9ef_0%,#FDF6E3_45%,#fef8e8_100%)] p-3 pt-4">
      <div
        className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#ff6b1a]/55 to-transparent"
        aria-hidden
      />
      <div className="flex gap-2">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            recipientPublicKeySpkiBase64 ? "Write an encrypted message…" : "Loading recipient key…"
          }
          disabled={disabled}
          rows={2}
          className="min-h-[4.5rem] flex-1 resize-none border-2 border-black font-mono text-xs"
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
          className="shrink-0 border-2 border-black bg-[#ff6b1a] text-white shadow-[3px_3px_0_0_#000] hover:bg-[#e85f12]"
          aria-label="Send message"
        >
          <PaperPlaneRight className="size-5" weight="bold" />
        </Button>
      </div>
      <p className="mt-2 font-mono text-[10px] text-muted-foreground">
        End-to-end encrypted on device. Enter sends, Shift+Enter newline.
      </p>
    </div>
  );
}
