"use client";

import type { SyntheticEvent } from "react";

import { AuthPasswordInput } from "@/components/auth/auth-password-input";
import { authInputClass, authLabelClass } from "@/components/auth/auth-styles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginForm } from "@/hooks/use-login-form";
import type { LoginFormValues } from "@/lib/auth/validate-login";
import { cn } from "@/lib/utils";

export type { LoginFormValues };

type LoginFormProps = {
  /** Called after client-side validation passes before submit. */
  onValidated?: (values: LoginFormValues) => void;
  onSwitchToRegister: () => void;
  defaultUsername?: string;
  submitDisabled?: boolean;
};

export function LoginForm({
  onValidated,
  onSwitchToRegister,
  defaultUsername = "",
  submitDisabled = false,
}: LoginFormProps) {
  const { username, password, setUsername, setPassword, errors, trySubmit } = useLoginForm({
    defaultUsername,
  });

  function handleSubmit(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    e.preventDefault();
    const values = trySubmit();
    if (values) onValidated?.(values);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-1">
      <div className="flex flex-col gap-2">
        <Label htmlFor="auth-login-username" className={authLabelClass}>
          Username
        </Label>
        <Input
          id="auth-login-username"
          name="username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={cn(authInputClass, "text-base sm:text-sm")}
          maxLength={32}
          aria-invalid={Boolean(errors.username)}
          aria-describedby={errors.username ? "auth-login-username-err" : undefined}
        />
        {errors.username ? (
          <p id="auth-login-username-err" role="alert" className="text-xs text-red-700">
            {errors.username}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="auth-login-password" className={authLabelClass}>
          Password
        </Label>
        <AuthPasswordInput
          id="auth-login-password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          maxLength={128}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "auth-login-password-err" : undefined}
          disabled={submitDisabled}
        />
        {errors.password ? (
          <p id="auth-login-password-err" role="alert" className="text-xs text-red-700">
            {errors.password}
          </p>
        ) : null}
        <p className="text-xs text-neutral-600">
          Unwrapping your private key uses this password only in this session — it is not sent in
          plaintext to the server.
        </p>
      </div>

      <Button
        type="submit"
        disabled={submitDisabled}
        className={cn(
          "font-oberyn-display h-11 w-full border-2 border-black bg-[#ff6b1a] text-sm uppercase tracking-wide text-white",
          "transition-[transform,box-shadow,background-color] duration-200 ease-out",
          "hover:bg-[#e85f12] hover:shadow-[3px_3px_0_0_#000] active:translate-y-px",
          "focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2",
        )}
      >
        Sign in
      </Button>

      <p className="text-center text-xs text-neutral-700">
        Need an account?{" "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="font-semibold text-black underline decoration-2 underline-offset-2 transition-colors hover:text-[#ff6b1a] focus-visible:rounded focus-visible:outline focus-visible:ring-2 focus-visible:ring-black"
        >
          Create one
        </button>
      </p>
    </form>
  );
}
