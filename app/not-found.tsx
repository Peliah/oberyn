import Link from "next/link";

import { OberynWordmark } from "@/components/brand/oberyn-wordmark";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center gap-8 bg-[#e8e6e1] px-6 py-16">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.06) 1px, transparent 0)`,
          backgroundSize: "20px 20px",
        }}
        aria-hidden
      />
      <div className="relative flex max-w-md flex-col items-center gap-8 text-center">
        <OberynWordmark className="max-w-[min(100%,360px)]" />
        <div className="space-y-2">
          <p className="font-oberyn-display text-2xl tracking-wide text-neutral-900">Page not found</p>
          <p className="font-mono text-sm text-muted-foreground">
            Nothing lives at this URL. Head back and try again.
          </p>
        </div>
        <Button
          asChild
          className="border-2 border-black bg-[#ff6b1a] font-mono text-xs uppercase tracking-wide text-white shadow-[3px_3px_0_0_#000] hover:bg-[#e85f12]"
        >
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
