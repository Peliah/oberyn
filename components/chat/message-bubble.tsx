import { cn } from "@/lib/utils";

type MessageBubbleProps = {
  text: string;
  mine: boolean;
};

export function MessageBubble({ text, mine }: MessageBubbleProps) {
  return (
    <div className={cn("flex w-full", mine ? "justify-end pl-8" : "justify-start pr-8")}>
      <div
        className={cn(
          "max-w-[min(88%,28rem)] border-2 border-black px-3.5 py-2.5 text-xs leading-relaxed shadow-[4px_4px_0_0_rgba(0,0,0,0.92)]",
          mine
            ? "rounded-sm rounded-br-md bg-[#ff6b1a] text-white ring-1 ring-black/20"
            : "rounded-sm rounded-bl-md bg-white text-foreground ring-1 ring-black/15",
        )}
      >
        <p className="whitespace-pre-wrap break-words">{text}</p>
      </div>
    </div>
  );
}
