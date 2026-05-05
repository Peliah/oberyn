"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

const primaryClassName = cn(
  "font-oberyn-display mt-8 inline-flex items-center justify-center border-2 border-black bg-[#ff6b1a] px-8 py-3 text-sm font-normal uppercase tracking-wide text-white",
  "transition-[transform,background-color,box-shadow] duration-150 ease-out",
  "hover:bg-[#e85f12] hover:shadow-[3px_3px_0_0_#000]",
  "active:translate-y-px active:shadow-none",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black",
  "motion-reduce:transition-none motion-reduce:hover:shadow-none",
);

type HeroPrimaryCtaProps = {
  onOpenAuth: () => void;
  chatHref?: string;
};

export function HeroPrimaryCta({ onOpenAuth, chatHref }: HeroPrimaryCtaProps) {
  if (chatHref) {
    return (
      <Link href={chatHref} className={primaryClassName}>
        Open chat
      </Link>
    );
  }

  return (
    <button type="button" onClick={onOpenAuth} className={primaryClassName}>
      Open Oberyn
    </button>
  );
}
