"use client";

import type { CSSProperties, ReactNode } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type ChatLayoutProps = {
  sidebarHeader: ReactNode;
  sidebarFooter: ReactNode;
  sidebarBody: ReactNode;
  /** Search field row on the main panel top bar (beside title / badges). */
  headerSearch: ReactNode;
  insetHeader: ReactNode;
  /** Icon or control pinned to the right edge of the top bar (after title / badges). */
  headerTrailing: ReactNode;
  main: ReactNode;
  className?: string;
};

export function ChatLayout({
  sidebarHeader,
  sidebarFooter,
  sidebarBody,
  headerSearch,
  insetHeader,
  headerTrailing,
  main,
  className,
}: ChatLayoutProps) {
  return (
    <div
      className={cn(
        "relative min-h-[100dvh] overflow-hidden bg-[#ff6b1a]",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              -12deg,
              transparent,
              transparent 18px,
              rgba(0,0,0,0.045) 18px,
              rgba(0,0,0,0.045) 19px
            ),
            repeating-linear-gradient(
              78deg,
              transparent,
              transparent 38px,
              rgba(255,255,255,0.04) 38px,
              rgba(255,255,255,0.04) 39px
            )
          `,
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-28 top-12 h-80 w-80 rounded-full border-2 border-black/20 bg-[#f9a8d4]/40 blur-[4px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-16 h-64 w-64 rounded-full border-2 border-black/15 bg-[#7dd3fc]/35 blur-[3px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/4 h-40 w-[120%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(253,246,227,0.35)_0%,transparent_65%)]"
        aria-hidden
      />

      <SidebarProvider
        className="relative z-[1] min-h-[100dvh]"
        style={
          {
            // Inline wins over SidebarProvider’s defaults (16rem); classes alone cannot override.
            "--sidebar-width": "24rem",
            "--sidebar-width-icon": "3.5rem",
          } as CSSProperties
        }
      >
        <Sidebar
          collapsible="icon"
          variant="inset"
          className={cn(
            "z-20 border-2 border-black bg-[#FDF6E3] text-foreground",
            "shadow-[6px_6px_0_0_rgba(0,0,0,0.88)]",
            "[&_[data-sidebar=sidebar]]:border-black/10",
          )}
        >
          <SidebarRail className="border-black/30 after:bg-black/10 hover:after:bg-[#ff6b1a]/25" />
          <SidebarHeader className="gap-2 border-b-2 border-black bg-[#fefbf2] px-2 py-3 group-data-[collapsible=icon]:gap-2 group-data-[collapsible=icon]:overflow-hidden group-data-[collapsible=icon]:px-1.5 group-data-[collapsible=icon]:py-2.5">
            {sidebarHeader}
          </SidebarHeader>
          <SidebarContent className="no-scrollbar gap-0 bg-[#fefbf2] px-0 pb-2 pt-1 group-data-[collapsible=icon]:pt-0">
            {sidebarBody}
          </SidebarContent>
          <SidebarFooter className="mt-auto border-t-2 border-black bg-[#fefbf2] p-2 group-data-[collapsible=icon]:p-2">
            {sidebarFooter}
          </SidebarFooter>
        </Sidebar>

        <SidebarInset
          className={cn(
            "relative min-h-[100dvh] flex-1 border-2 border-black",
            "shadow-[10px_10px_0_0_rgba(0,0,0,0.88)] md:m-3 md:min-h-[calc(100dvh-1.5rem)] md:rounded-sm",
          )}
          style={{
            backgroundImage: `
              radial-gradient(900px 420px at 12% -10%, rgba(255,107,26,0.09), transparent 55%),
              radial-gradient(700px 400px at 92% 105%, rgba(125,211,252,0.14), transparent 50%),
              linear-gradient(175deg, #fffef8 0%, #fdf6e3 55%, #fefce8 100%)
            `,
          }}
        >
          <header className="sticky top-0 z-[2] flex shrink-0 flex-wrap items-center gap-x-2 gap-y-2 overflow-visible border-b-2 border-black bg-[linear-gradient(180deg,rgba(253,246,227,0.96)_0%,rgba(254,251,242,0.88)_100%)] px-3 py-2.5 backdrop-blur-md supports-[backdrop-filter]:bg-[#FDF6E3]/72">
            <SidebarTrigger
              className="shrink-0 border-2 border-black bg-white text-foreground shadow-[2px_2px_0_0_#000] hover:bg-[#ff6b1a]/12"
              title="Toggle conversations"
            />
            <div className="min-h-9 min-w-0 flex-1 basis-[min(100%,18rem)] lg:max-w-3xl">{headerSearch}</div>
            <div className="ml-auto flex min-w-0 shrink-0 items-center gap-2">
              <div className="flex min-w-0 flex-col items-end gap-0.5 sm:items-start md:max-w-[min(40vw,14rem)] md:items-end lg:max-w-xs">
                {insetHeader}
              </div>
              <div className="shrink-0">{headerTrailing}</div>
            </div>
          </header>
          <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
              <div className="flex min-h-0 w-full flex-col">
                {main}
              </div>
            <aside
              className="relative hidden min-h-0 w-[min(15rem,22vw)] shrink-0 flex-col border-t-2 border-dashed border-black/20 bg-[linear-gradient(165deg,#fffaf3_0%,#fef6e8_45%,#fdf2dc_100%)] px-3 py-5 lg:flex lg:border-t-0 lg:border-l-2 xl:w-[min(17rem,18vw)]"
              aria-label="Chat notes"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.22]"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    -18deg,
                    transparent,
                    transparent 14px,
                    rgba(0,0,0,0.06) 14px,
                    rgba(0,0,0,0.06) 15px
                  )`,
                }}
                aria-hidden
              />
              <div className="relative flex min-h-0 flex-1 flex-col gap-4">
                <div>
                  <p className="font-oberyn-display text-[11px] uppercase tracking-[0.22em] text-neutral-700">
                    Private lane
                  </p>
                  <p className="mt-2 font-mono text-[10px] leading-relaxed text-muted-foreground">
                    Text is encrypted on your device. The network only carries ciphertext.
                  </p>
                </div>
                <div className="h-px w-full bg-black/12" />
                <p className="font-mono text-[9px] leading-relaxed text-muted-foreground/90">
                  <kbd className="rounded border border-black/40 bg-white/90 px-1 py-px font-mono text-[8px]">
                    ⌘B
                  </kbd>{" "}
                  /{" "}
                  <kbd className="rounded border border-black/40 bg-white/90 px-1 py-px font-mono text-[8px]">
                    Ctrl+B
                  </kbd>
                  <span className="mt-1 block">Toggle the thread index.</span>
                </p>
              </div>
            </aside>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
