import { Spinner } from "@/components/ui/spinner";

export function ChatLoading() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-3 bg-[#e8e6e1] px-4 text-neutral-800">
      <Spinner className="size-6 text-[#ff6b1a]" />
      <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">Loading…</p>
    </div>
  );
}
