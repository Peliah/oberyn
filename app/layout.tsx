import type { Metadata } from "next";
import { Archivo_Black, DM_Sans, Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const oberynDisplay = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-oberyn-display",
});

const oberynSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-oberyn-sans",
});

export const metadata: Metadata = {
  title: "Oberyn — end-to-end encrypted messaging",
  description:
    "Messages are encrypted on your device. The server only ever sees ciphertext.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased",
        geistSans.variable,
        geistMono.variable,
        jetbrainsMono.variable,
        oberynDisplay.variable,
        oberynSans.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <AppProviders>
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </AppProviders>
      </body>
    </html>
  );
}
