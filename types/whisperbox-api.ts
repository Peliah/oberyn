/** DTOs aligned with `docs/whisperbox-openapi.json`. */

export type UserProfile = {
  id: string;
  username: string;
  display_name: string;
  public_key: string;
  wrapped_private_key: string;
  pbkdf2_salt: string;
  created_at: string;
};

export type AuthResponse = {
  access_token: string;
  refresh_token: string;
  token_type?: string;
  expires_in: number;
  user: UserProfile;
};

export type TokenResponse = {
  access_token: string;
  token_type?: string;
  expires_in: number;
};

export type RegisterRequest = {
  username: string;
  display_name: string;
  password: string;
  public_key: string;
  wrapped_private_key: string;
  pbkdf2_salt: string;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type RefreshRequest = {
  refresh_token: string;
};

export type HealthResponse = {
  status?: string;
  environment: string;
};

export type UserPublicInfo = {
  id: string;
  username: string;
  display_name: string;
};

export type UserPublicKey = {
  public_key: string;
};

export type ApiValidationError = {
  detail?: Array<{ loc: unknown[]; msg: string; type: string }>;
};
