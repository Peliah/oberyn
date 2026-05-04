import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type LandingShellProps = {
  children: ReactNode;
};

export function LandingShell({ children }: LandingShellProps) {
  return (
    <div
      className={cn(
        "relative min-h-screen overflow-hidden bg-[#ff6b1a] px-4 py-10 sm:px-6 sm:py-14 lg:px-10",
        "flex flex-col items-center justify-center",
      )}
    >
      {/* Soft accent blobs — decorative */}
      <div
        className="pointer-events-none absolute -left-16 top-10 h-40 w-40 rounded-full border-2 border-black/20 bg-[#f9a8d4]/80 blur-[2px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-12 bottom-24 h-32 w-32 rounded-full border-2 border-black/20 bg-[#7dd3fc]/70 blur-[2px]"
        aria-hidden
      />
      {children}
    </div>
  );
}
