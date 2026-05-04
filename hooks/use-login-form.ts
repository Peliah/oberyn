"use client";

import { useCallback, useState } from "react";

import {
  type LoginFieldErrors,
  type LoginFormValues,
  validateLoginInput,
} from "@/lib/auth/validate-login";

type UseLoginFormOptions = {
  defaultUsername?: string;
};

export function useLoginForm(options: UseLoginFormOptions = {}) {
  const { defaultUsername = "" } = options;
  const [username, setUsername] = useState(defaultUsername);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginFieldErrors>({});

  const trySubmit = useCallback((): LoginFormValues | null => {
    const result = validateLoginInput({ username, password });
    if (!result.ok) {
      setErrors(result.errors);
      return null;
    }
    setErrors({});
    return result.values;
  }, [username, password]);

  const reset = useCallback(() => {
    setUsername(defaultUsername);
    setPassword("");
    setErrors({});
  }, [defaultUsername]);

  return {
    username,
    password,
    setUsername,
    setPassword,
    errors,
    trySubmit,
    reset,
  };
}

export type { LoginFormValues } from "@/lib/auth/validate-login";
