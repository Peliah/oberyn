"use client";

import type { SyntheticEvent } from "react";

import { AuthPasswordInput } from "@/components/auth/auth-password-input";
import { authInputClass, authLabelClass } from "@/components/auth/auth-styles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegisterForm } from "@/hooks/use-register-form";
import type { RegisterFormValues } from "@/lib/auth/validate-register";
import { cn } from "@/lib/utils";

export type { RegisterFormValues };

type RegisterFormProps = {
  onValidated?: (values: RegisterFormValues) => void;
  onSwitchToLogin: () => void;
  submitDisabled?: boolean;
};

export function RegisterForm({
  onValidated,
  onSwitchToLogin,
  submitDisabled = false,
}: RegisterFormProps) {
  const {
    username,
    displayName,
    password,
    confirmPassword,
    setUsername,
    setDisplayName,
    setPassword,
    setConfirmPassword,
    errors,
    trySubmit,
  } = useRegisterForm();

  function handleSubmit(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    e.preventDefault();
    const values = trySubmit();
    if (values) onValidated?.(values);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-1">
      <div className="flex flex-col gap-2">
        <Label htmlFor="auth-reg-username" className={authLabelClass}>
          Username
        </Label>
        <Input
          id="auth-reg-username"
          name="username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={cn(authInputClass, "text-base sm:text-sm")}
          minLength={3}
          maxLength={32}
          aria-invalid={Boolean(errors.username)}
        />
        {errors.username ? (
          <p role="alert" className="text-xs text-red-700">
            {errors.username}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="auth-reg-display" className={authLabelClass}>
          Display name
        </Label>
        <Input
          id="auth-reg-display"
          name="displayName"
          autoComplete="name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className={cn(authInputClass, "text-base sm:text-sm")}
          maxLength={128}
          aria-invalid={Boolean(errors.displayName)}
        />
        {errors.displayName ? (
          <p role="alert" className="text-xs text-red-700">
            {errors.displayName}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="auth-reg-password" className={authLabelClass}>
          Password
        </Label>
        <AuthPasswordInput
          id="auth-reg-password"
          name="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          maxLength={128}
          aria-invalid={Boolean(errors.password)}
          disabled={submitDisabled}
        />
        {errors.password ? (
          <p role="alert" className="text-xs text-red-700">
            {errors.password}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="auth-reg-confirm" className={authLabelClass}>
          Confirm password
        </Label>
        <AuthPasswordInput
          id="auth-reg-confirm"
          name="confirmPassword"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          aria-invalid={Boolean(errors.confirmPassword)}
          disabled={submitDisabled}
        />
        {errors.confirmPassword ? (
          <p role="alert" className="text-xs text-red-700">
            {errors.confirmPassword}
          </p>
        ) : null}
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
        Create account
      </Button>

      <p className="text-center text-xs text-neutral-700">
        Already using Oberyn?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-semibold text-black underline decoration-2 underline-offset-2 transition-colors hover:text-[#ff6b1a] focus-visible:rounded focus-visible:outline focus-visible:ring-2 focus-visible:ring-black"
        >
          Sign in
        </button>
      </p>
    </form>
  );
}
