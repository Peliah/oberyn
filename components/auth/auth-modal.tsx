"use client";

import { useState } from "react";

import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import type { LoginFormValues } from "@/lib/auth/validate-login";
import type { RegisterFormValues } from "@/lib/auth/validate-register";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

type AuthMode = "login" | "register";

type AuthModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const { login, register, isLoggingIn, isRegistering } = useAuth({
    onAuthenticated: () => onOpenChange(false),
  });

  function handleOpenChange(next: boolean) {
    if (next) setMode("login");
    onOpenChange(next);
  }

  async function handleLoginValidated(values: LoginFormValues) {
    await login(values);
  }

  async function handleRegisterValidated(values: RegisterFormValues) {
    await register(values);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          "font-oberyn-body max-h-[min(90vh,42rem)] gap-0 overflow-y-auto border-2 border-black bg-[#FDF6E3] p-0 text-neutral-900 sm:max-w-md",
          "rounded-xl shadow-[8px_8px_0_0_#000]",
        )}
        showCloseButton
      >
        <div className="border-b-2 border-black px-4 pt-4 pb-3">
          <DialogHeader className="gap-2 text-left">
            <DialogTitle className="font-oberyn-display text-xl text-black">
              {mode === "login" ? "Sign in to Oberyn" : "Create your Oberyn account"}
            </DialogTitle>
            <DialogDescription className="text-sm text-neutral-800">
              {mode === "login"
                ? "Your private key stays wrapped until you unlock it here — the server never sees plaintext keys or messages."
                : "Keys are generated on this device. You send only your public key and wrapped private key — never plaintext PKCS#8."}
            </DialogDescription>
          </DialogHeader>

          <div
            className="mt-4 grid grid-cols-2 gap-0 overflow-hidden rounded-lg border-2 border-black bg-neutral-900/5 p-1"
            role="tablist"
            aria-label="Authentication mode"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === "login"}
              className={cn(
                "font-oberyn-display py-2.5 text-xs uppercase tracking-wide transition-colors duration-200",
                mode === "login"
                  ? "bg-[#ff6b1a] text-white shadow-[2px_2px_0_0_#000]"
                  : "bg-transparent text-neutral-700 hover:bg-white/80",
              )}
              onClick={() => setMode("login")}
            >
              Sign in
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "register"}
              className={cn(
                "font-oberyn-display py-2.5 text-xs uppercase tracking-wide transition-colors duration-200",
                mode === "register"
                  ? "bg-[#ff6b1a] text-white shadow-[2px_2px_0_0_#000]"
                  : "bg-transparent text-neutral-700 hover:bg-white/80",
              )}
              onClick={() => setMode("register")}
            >
              Register
            </button>
          </div>
        </div>

        <div className="px-4 pb-4 pt-3">
          {mode === "login" ? (
            <LoginForm
              submitDisabled={isLoggingIn}
              onValidated={handleLoginValidated}
              onSwitchToRegister={() => setMode("register")}
            />
          ) : (
            <RegisterForm
              submitDisabled={isRegistering}
              onValidated={handleRegisterValidated}
              onSwitchToLogin={() => setMode("login")}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
