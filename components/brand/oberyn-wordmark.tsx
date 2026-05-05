import Image from "next/image";

import { cn } from "@/lib/utils";

type OberynWordmarkProps = {
  className?: string;
  priority?: boolean;
};

/** Oberyn wordmark from `/public/oberyn_wordmark_only.svg`. */
export function OberynWordmark({ className, priority }: OberynWordmarkProps) {
  return (
    <Image
      src="/oberyn_wordmark_only.svg"
      alt="Oberyn"
      width={680}
      height={200}
      className={cn("h-auto w-full object-contain object-left", className)}
      unoptimized
      priority={priority}
    />
  );
}
