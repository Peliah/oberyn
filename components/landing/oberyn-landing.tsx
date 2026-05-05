"use client";

import { useState } from "react";

import { AuthModal } from "@/components/auth/auth-modal";
import { HeroAsideVisual } from "@/components/landing/hero-aside-visual";
import { HeroCard } from "@/components/landing/hero-card";
import { HeroHeading } from "@/components/landing/hero-heading";
import { HeroPrimaryCta } from "@/components/landing/hero-primary-cta";
import { HeroTagline } from "@/components/landing/hero-tagline";
import { LandingShell } from "@/components/landing/landing-shell";
import { useSession } from "@/lib/session/session-context";

export function OberynLanding() {
  const [authOpen, setAuthOpen] = useState(false);
  const { accessToken, sessionRestored } = useSession();

  return (
    <>
      <LandingShell>
        <div className="font-oberyn-body relative z-10 w-full max-w-6xl">
          <HeroCard>
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-12">
              <div>
                <HeroHeading />
                <HeroTagline />
                <HeroPrimaryCta
                  onOpenAuth={() => setAuthOpen(true)}
                  chatHref={sessionRestored && accessToken ? "/chat" : undefined}
                />
              </div>
              <HeroAsideVisual />
            </div>
          </HeroCard>
        </div>
      </LandingShell>
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
}
