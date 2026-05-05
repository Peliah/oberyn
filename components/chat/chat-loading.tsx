import { Spinner } from "@/components/ui/spinner";

export function ChatLoading() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-3 bg-[#ff6b1a] px-4 text-white">
      <Spinner className="size-6 text-white" />
      <p className="font-mono text-xs uppercase tracking-wide">Loading chat…</p>
    </div>
  );
}
