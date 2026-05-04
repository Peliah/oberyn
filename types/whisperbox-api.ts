import type { EncryptedPayload } from "@/types/encrypted-payload";

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

export type ConversationSummary = {
  user_id: string;
  display_name: string;
  username: string;
  last_message_at: string | null;
};

export type MessageResponse = {
  id: string;
  from_user_id: string;
  to_user_id: string;
  payload: Record<string, unknown>;
  delivered: boolean;
  created_at: string;
};

export type SendMessageRequest = {
  to: string;
  payload: EncryptedPayload;
};

export type ApiValidationError = {
  detail?: Array<{ loc: unknown[]; msg: string; type: string }>;
};
