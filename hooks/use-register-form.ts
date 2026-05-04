"use client";

import { useCallback, useState } from "react";

import {
  type RegisterFieldErrors,
  type RegisterFormValues,
  validateRegisterInput,
} from "@/lib/auth/validate-register";

export function useRegisterForm() {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<RegisterFieldErrors>({});

  const trySubmit = useCallback((): RegisterFormValues | null => {
    const result = validateRegisterInput({
      username,
      displayName,
      password,
      confirmPassword,
    });
    if (!result.ok) {
      setErrors(result.errors);
      return null;
    }
    setErrors({});
    return result.values;
  }, [username, displayName, password, confirmPassword]);

  const reset = useCallback(() => {
    setUsername("");
    setDisplayName("");
    setPassword("");
    setConfirmPassword("");
    setErrors({});
  }, []);

  return {
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
    reset,
  };
}

export type { RegisterFormValues } from "@/lib/auth/validate-register";
