"use client";

import { EyeIcon, EyeSlashIcon } from "@phosphor-icons/react";
import { useId, useState, type ComponentProps } from "react";

import { authInputClass } from "@/components/auth/auth-styles";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type AuthPasswordInputProps = Omit<ComponentProps<typeof Input>, "type">;

export function AuthPasswordInput({
  id: idProp,
  className,
  disabled,
  ...props
}: AuthPasswordInputProps) {
  const reactId = useId();
  const id = idProp ?? reactId;
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        id={id}
        type={visible ? "text" : "password"}
        disabled={disabled}
        className={cn(authInputClass, "pr-11 text-base sm:text-sm", className)}
        {...props}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => setVisible((v) => !v)}
        className={cn(
          "absolute right-0 top-0 flex h-11 w-11 items-center justify-center rounded-r-lg text-neutral-600 outline-none transition-colors",
          "hover:text-black",
          "focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-black",
          "disabled:pointer-events-none disabled:opacity-40",
        )}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-controls={id}
        aria-pressed={visible}
      >
        {visible ? (
          <EyeSlashIcon className="size-5" weight="bold" aria-hidden />
        ) : (
          <EyeIcon className="size-5" weight="bold" aria-hidden />
        )}
      </button>
    </div>
  );
}
