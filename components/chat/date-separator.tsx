import { format } from "date-fns";

import { cn } from "@/lib/utils";

type DateSeparatorProps = {
  date: Date;
  className?: string;
};

export function DateSeparator({ date, className }: DateSeparatorProps) {
  return (
    <div className={cn("flex justify-center py-3", className)}>
      <span className="rounded-none border border-black bg-white/90 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        {format(date, "MMM d, yyyy")}
      </span>
    </div>
  );
}
