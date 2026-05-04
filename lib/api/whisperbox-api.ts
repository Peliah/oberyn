import { whisperboxRequest } from "@/lib/api/api-client";
import type {
  AuthResponse,
  HealthResponse,
  LoginRequest,
  RegisterRequest,
  TokenResponse,
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

export async function refreshWhisperbox(refreshToken: string): Promise<TokenResponse> {
  return whisperboxRequest<TokenResponse>("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
}

export async function logoutWhisperbox(
  refreshToken: string,
  accessToken: string,
): Promise<void> {
  await whisperboxRequest("/auth/logout", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
    token: accessToken,
  });
}

export async function healthWhisperbox(): Promise<HealthResponse> {
  return whisperboxRequest<HealthResponse>("/health", { method: "GET" });
}
