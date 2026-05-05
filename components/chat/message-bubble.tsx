import { cn } from "@/lib/utils";

type MessageBubbleProps = {
  text: string;
  mine: boolean;
};

export function MessageBubble({ text, mine }: MessageBubbleProps) {
  return (
    <div className={cn("flex w-full", mine ? "justify-end pl-6" : "justify-start pr-6")}>
      <div
        className={cn(
          "max-w-[min(90%,26rem)] border-2 border-black px-3 py-2 text-sm leading-relaxed shadow-[2px_2px_0_0_rgba(0,0,0,1)]",
          mine ? "rounded-md rounded-br-sm bg-[#ff6b1a] text-white" : "rounded-md rounded-bl-sm bg-white text-foreground",
        )}
      >
        <p className="whitespace-pre-wrap break-words">{text}</p>
      </div>
    </div>
  );
}
