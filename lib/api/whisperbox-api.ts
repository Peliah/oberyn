import { whisperboxRequest } from "@/lib/api/api-client";
import type {
  AuthResponse,
  ConversationSummary,
  HealthResponse,
  LoginRequest,
  MessageResponse,
  RegisterRequest,
  SendMessageRequest,
  TokenResponse,
  UserProfile,
  UserPublicInfo,
  UserPublicKey,
} from "@/types/whisperbox-api";

export async function registerWhisperbox(body: RegisterRequest): Promise<AuthResponse> {
  return whisperboxRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function loginWhisperbox(body: LoginRequest): Promise<AuthResponse> {
  return whisperboxRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function meWhisperbox(accessToken: string): Promise<UserProfile> {
  return whisperboxRequest<UserProfile>("/auth/me", {
    method: "GET",
    token: accessToken,
  });
}

export async function refreshWhisperbox(refreshToken: string): Promise<TokenResponse> {
  return whisperboxRequest<TokenResponse>("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
}

export async function logoutWhisperbox(refreshToken: string, accessToken: string): Promise<void> {
  await whisperboxRequest("/auth/logout", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
    token: accessToken,
  });
}

export async function searchUsersWhisperbox(q: string, accessToken: string): Promise<UserPublicInfo[]> {
  const path = `/users/search?q=${encodeURIComponent(q)}`;
  return whisperboxRequest<UserPublicInfo[]>(path, {
    method: "GET",
    token: accessToken,
  });
}

export async function getUserPublicKeyWhisperbox(
  userId: string,
  accessToken: string,
): Promise<UserPublicKey> {
  return whisperboxRequest<UserPublicKey>(`/users/${userId}/public-key`, {
    method: "GET",
    token: accessToken,
  });
}

export async function listConversationsWhisperbox(accessToken: string): Promise<ConversationSummary[]> {
  return whisperboxRequest<ConversationSummary[]>("/conversations", {
    method: "GET",
    token: accessToken,
  });
}

export async function getConversationMessagesWhisperbox(
  userId: string,
  accessToken: string,
  options?: { limit?: number; before?: string | null },
): Promise<MessageResponse[]> {
  const params = new URLSearchParams();
  if (options?.limit != null) params.set("limit", String(options.limit));
  if (options?.before != null && options.before !== "") params.set("before", options.before);
  const qs = params.toString();
  const path = `/conversations/${userId}/messages${qs ? `?${qs}` : ""}`;
  return whisperboxRequest<MessageResponse[]>(path, {
    method: "GET",
    token: accessToken,
  });
}

export async function sendMessageWhisperbox(
  body: SendMessageRequest,
  accessToken: string,
): Promise<MessageResponse> {
  return whisperboxRequest<MessageResponse>("/messages", {
    method: "POST",
    body: JSON.stringify(body),
    token: accessToken,
  });
}

export async function healthWhisperbox(): Promise<HealthResponse> {
  return whisperboxRequest<HealthResponse>("/health", { method: "GET" });
}
