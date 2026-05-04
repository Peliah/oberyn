import { cn } from "@/lib/utils";

/** Shared neo-brutalist input styling for auth dialogs */
export const authInputClass = cn(
  "h-11 w-full rounded-lg border-2 border-black bg-white px-3 py-2 text-sm text-neutral-900 shadow-none",
  "placeholder:text-neutral-500",
  "focus-visible:border-black focus-visible:ring-2 focus-visible:ring-black/25 focus-visible:outline-none",
  "disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:opacity-70",
  "aria-invalid:border-red-600 aria-invalid:focus-visible:ring-red-600/30",
);

export const authLabelClass =
  "font-oberyn-body text-xs font-semibold uppercase tracking-wide text-neutral-800";
