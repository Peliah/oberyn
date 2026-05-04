export type LoginFormValues = {
  username: string;
  password: string;
};

export type LoginFieldErrors = Partial<Record<keyof LoginFormValues, string>>;

export type LoginValidationResult =
  | { ok: true; values: LoginFormValues }
  | { ok: false; errors: LoginFieldErrors };

/** Client-side rules aligned with WhisperBox `LoginRequest` (username/password present). */
export function validateLoginInput(raw: {
  username: string;
  password: string;
}): LoginValidationResult {
  const errors: LoginFieldErrors = {};
  const username = raw.username.trim();

  if (username.length < 1) {
    errors.username = "Username is required.";
  }
  if (raw.password.length < 1) {
    errors.password = "Password is required.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    values: { username, password: raw.password },
  };
}
