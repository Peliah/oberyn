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
  /** Optional; when set, appears in the main top bar (e.g. leave empty for a calmer bar). */
  headerSearch?: ReactNode;
  /** Optional right cluster beside search (user badges, etc.). */
  insetHeader?: ReactNode;
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
    <div className={cn("relative min-h-[100dvh] overflow-hidden bg-[#e8e6e1]", className)}>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.06) 1px, transparent 0)`,
          backgroundSize: "20px 20px",
        }}
        aria-hidden
      />

      <SidebarProvider
        className="relative z-[1] min-h-[100dvh]"
        style={
          {
            "--sidebar-width": "22rem",
            "--sidebar-width-icon": "3.25rem",
          } as CSSProperties
        }
      >
        <Sidebar
          collapsible="icon"
          variant="inset"
          className={cn(
            "z-20 border-2 border-black bg-white text-foreground",
            "shadow-[4px_4px_0_0_rgba(0,0,0,1)]",
          )}
        >
          <SidebarRail className="border-black/20 after:bg-black/10 hover:after:bg-black/20" />
          <SidebarHeader className="gap-0 border-b-2 border-black bg-white px-3 py-4 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-3">
            {sidebarHeader}
          </SidebarHeader>
          <SidebarContent className="no-scrollbar gap-0 bg-white px-0 pb-2 pt-0 group-data-[collapsible=icon]:pt-0">
            {sidebarBody}
          </SidebarContent>
          <SidebarFooter className="mt-auto border-t-2 border-black bg-white p-3 group-data-[collapsible=icon]:p-2">
            {sidebarFooter}
          </SidebarFooter>
        </Sidebar>

        <SidebarInset
          className={cn(
            "relative min-h-[100dvh] flex-1 border-2 border-black bg-[#f5f5f0]",
            "shadow-[4px_4px_0_0_rgba(0,0,0,1)] md:m-3 md:min-h-[calc(100dvh-1.5rem)] md:rounded-md",
          )}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.55]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.07) 1px, transparent 0)`,
              backgroundSize: "18px 18px",
            }}
            aria-hidden
          />
          <header className="relative z-[2] flex shrink-0 flex-wrap items-center gap-2 border-b-2 border-black bg-[#f5f5f0]/95 px-3 py-3 backdrop-blur-sm supports-[backdrop-filter]:bg-[#f5f5f0]/88">
            <SidebarTrigger
              className="shrink-0 border-2 border-black bg-white text-foreground shadow-[2px_2px_0_0_#000] hover:bg-neutral-100"
              title="Conversations"
            />
            {headerSearch ? (
              <div className="min-h-9 min-w-0 flex-1 basis-[min(100%,18rem)] lg:max-w-2xl">{headerSearch}</div>
            ) : (
              <div className="min-w-0 flex-1" aria-hidden />
            )}
            {(insetHeader || headerTrailing) && (
              <div className="ml-auto flex shrink-0 items-center gap-2">
                {insetHeader}
                {headerTrailing}
              </div>
            )}
          </header>
          <div className="relative z-[1] flex min-h-0 flex-1 flex-col">{main}</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
