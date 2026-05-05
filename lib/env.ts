const ENV_KEY = "NEXT_PUBLIC_WHISPERBOX_URL";

function readWhisperboxUrl(): string {
  const raw = process.env[ENV_KEY];
  if (!raw || raw.trim() === "") {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `[env] Missing ${ENV_KEY}. Copy .env.example to .env.local and set the backend API URL.`,
      );
    }
    return "";
  }
  return raw.trim().replace(/\/+$/, "");
}

export function getWhisperboxHttpOrigin(): string {
  return readWhisperboxUrl();
}

export function getWhisperboxWsUrl(accessToken: string): string {
  const origin = readWhisperboxUrl();
  if (!origin) {
    throw new Error(`${ENV_KEY} is not set`);
  }
  let url: URL;
  try {
    url = new URL(origin);
  } catch {
    throw new Error(`${ENV_KEY} must be a valid URL`);
  }
  const wsProto = url.protocol === "https:" ? "wss:" : "ws:";
  const ws = new URL(origin);
  ws.protocol = wsProto;
  ws.pathname = "/ws";
  ws.searchParams.set("token", accessToken);
  return ws.toString();
}

export function assertWhisperboxConfigured(): void {
  if (!readWhisperboxUrl()) {
    throw new Error(`${ENV_KEY} is not set`);
  }
}
