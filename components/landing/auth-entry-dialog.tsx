"use client";

import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type AuthEntryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AuthEntryDialog({ open, onOpenChange }: AuthEntryDialogProps) {
  function handleComingSoon() {
    toast.message("Authentication is coming in the next step.", {
      description: "Keys will stay on your device — same promise as the full app.",
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="font-oberyn-body border-2 border-black bg-[#FDF6E3] text-neutral-900 sm:max-w-md"
        showCloseButton
      >
        <DialogHeader>
          <DialogTitle className="font-oberyn-display text-lg text-black">
            Sign in to Oberyn
          </DialogTitle>
          <DialogDescription className="text-neutral-800">
            Your private key and password never leave this browser in plaintext. The server stores
            wrapped keys and ciphertext only.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            type="button"
            className="w-full border-2 border-black bg-[#ff6b1a] text-white hover:bg-[#e85f12]"
            onClick={handleComingSoon}
          >
            Continue
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full border-2 border-black bg-transparent"
            onClick={handleComingSoon}
          >
            Create an account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
