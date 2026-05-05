"use client";

import { LockKey } from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "sonner";

import { AuthPasswordInput } from "@/components/auth/auth-password-input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useSession } from "@/lib/session/session-context";
import { cn } from "@/lib/utils";

/** After refresh, API tokens are restored but the private key stays in memory only — ask for password once to unwrap. */
export function SessionUnlockGate() {
  const { sessionRestored, accessToken, user, privateKey, unlockWithPassword } = useSession();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const needsUnlock = Boolean(sessionRestored && accessToken && user && !privateKey);
  const open = needsUnlock;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) {
      toast.error("Enter your password");
      return;
    }
    setBusy(true);
    try {
      await unlockWithPassword(password.trim());
      setPassword("");
      toast.success("Encryption unlocked on this device.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not unlock");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        onPointerDownOutside={(ev) => ev.preventDefault()}
        onEscapeKeyDown={(ev) => ev.preventDefault()}
        className={cn(
          "max-w-md border-2 border-black bg-[#FDF6E3] shadow-[8px_8px_0_0_#000]",
          "rounded-xl",
        )}
      >
        <form onSubmit={submit}>
          <DialogHeader>
            <div className="flex items-center gap-2">
              <LockKey className="size-8 text-[#ff6b1a]" weight="duotone" aria-hidden />
              <DialogTitle className="font-oberyn-display text-left text-xl">
                Unlock encryption
              </DialogTitle>
            </div>
            <DialogDescription className="text-left text-sm text-neutral-800">
              Your session is restored, but your private key only lives in memory. Enter your account
              password once to unwrap it and read encrypted messages on this device.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-2">
            <Label htmlFor="unlock-pass" className="font-mono text-xs uppercase tracking-wide">
              Password
            </Label>
            <AuthPasswordInput
              id="unlock-pass"
              name="unlock-password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={busy}
              className="border-2 border-black"
            />
          </div>
          <DialogFooter className="mt-6 gap-2 sm:gap-2">
            <Button
              type="submit"
              disabled={busy || !password.trim()}
              className="w-full border-2 border-black bg-[#ff6b1a] font-oberyn-display uppercase tracking-wide text-white hover:bg-[#e85f12]"
            >
              {busy ? "Unlocking…" : "Unlock"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
