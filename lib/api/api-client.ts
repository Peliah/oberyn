import { assertWhisperboxConfigured, getWhisperboxHttpOrigin } from "@/lib/env";

export class WhisperboxApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "WhisperboxApiError";
    this.status = status;
    this.body = body;
  }
}

function formatErrorBody(status: number, body: unknown): string {
  if (body && typeof body === "object" && "detail" in body) {
    const detail = (body as { detail?: unknown }).detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail) && detail.length > 0) {
      const first = detail[0] as { msg?: string };
      if (first?.msg) return first.msg;
    }
  }
  return `Request failed (${status})`;
}

export type WhisperboxRequestInit = RequestInit & {
  token?: string;
};

export async function whisperboxRequest<T>(
  path: string,
  init: WhisperboxRequestInit = {},
): Promise<T> {
  assertWhisperboxConfigured();
  const { token, ...restInit } = init;
  const base = getWhisperboxHttpOrigin();
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;

  const headers = new Headers(restInit.headers);
  if (!headers.has("Content-Type") && restInit.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const res = await fetch(url, { ...restInit, headers });
  const text = await res.text();
  let body: unknown = undefined;
  if (text) {
    try {
      body = JSON.parse(text) as unknown;
    } catch {
      body = text;
    }
  }

  if (!res.ok) {
    const msg = formatErrorBody(res.status, body);
    throw new WhisperboxApiError(msg, res.status, body);
  }

  return body as T;
}
