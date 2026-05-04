export type RegisterFormValues = {
  username: string;
  displayName: string;
  password: string;
};

export type RegisterFieldKey = keyof RegisterFormValues | "confirmPassword";

export type RegisterFieldErrors = Partial<Record<RegisterFieldKey, string>>;

export type RegisterValidationResult =
  | { ok: true; values: RegisterFormValues }
  | { ok: false; errors: RegisterFieldErrors };

/** Client-side rules aligned with WhisperBox `RegisterRequest` OpenAPI limits. */
export function validateRegisterInput(raw: {
  username: string;
  displayName: string;
  password: string;
  confirmPassword: string;
}): RegisterValidationResult {
  const errors: RegisterFieldErrors = {};
  const username = raw.username.trim();
  const displayName = raw.displayName.trim();

  if (username.length < 3) {
    errors.username = "Username must be at least 3 characters.";
  } else if (username.length > 32) {
    errors.username = "Username must be at most 32 characters.";
  }

  if (displayName.length < 1) {
    errors.displayName = "Display name is required.";
  } else if (displayName.length > 128) {
    errors.displayName = "Display name must be at most 128 characters.";
  }

  if (raw.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  } else if (raw.password.length > 128) {
    errors.password = "Password must be at most 128 characters.";
  }

  if (raw.confirmPassword !== raw.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    values: {
      username,
      displayName,
      password: raw.password,
    },
  };
}
