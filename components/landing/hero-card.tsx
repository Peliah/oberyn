import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type HeroCardProps = {
  children: ReactNode;
  className?: string;
};

export function HeroCard({ children, className }: HeroCardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-5xl rounded-2xl border-2 border-black bg-[#FDF6E3] p-6 shadow-[6px_6px_0_0_#000] sm:p-8 lg:p-10",
        "motion-reduce:shadow-[6px_6px_0_0_#000]",
        className,
      )}
    >
      {children}
    </div>
  );
}
