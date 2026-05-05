# Oberyn

**Oberyn** is a web client for **end-to-end encrypted messaging**. Plaintext is encrypted on your device before anything is sent; the backend only handles ciphertext, tokens, and delivery metadata—not readable message content.

## What this project covers

- **Accounts**: Registration and sign-in tied to a remote API.
- **Direct conversations**: Open a thread with another user, load history, and send new messages.
- **User discovery**: Search for people to start a conversation.
- **Cryptography on the client**: Keys and decrypt/unwrapping stay in the browser; messages are protected in transit and at rest on the server as encrypted payloads.
- **Sessions**: Authenticated session with optional unlock flows so sensitive key material is not left exposed lightly.

The app is built so **trust is minimized**: you control keys on your machine; the service coordinates routing and storage of opaque blobs, not readable chat text.

## Requirements

- **Node.js** (version compatible with Next.js 16 — see `package.json` engines if present).
- A running **HTTP API** compatible with this client (REST for auth, conversations, messages, user search, public keys; WebSocket for realtime delivery where configured). Set its base URL via environment variables below.

## Setup

1. Copy environment template and point it at your API:

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and set `NEXT_PUBLIC_WHISPERBOX_URL` to your backend’s HTTPS origin (no trailing slash issues — the app normalizes it).

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Local development server |
| `npm run build`| Production build         |
| `npm run start`| Serve production build     |
| `npm run lint` | ESLint                   |
| `npm test`     | Vitest unit tests        |

## Stack (overview)

- **Next.js** (App Router), **React**, **TypeScript**
- **TanStack Query** for server state
- **Web Crypto** and app-specific crypto helpers for envelopes and keys (see `lib/crypto`, `lib/chat`)

## Missing routes

Unknown URLs render the app’s **404** page (`app/not-found.tsx`) with navigation back home.

---

Questions about deployment, API contracts, or threat model belong with your backend and security docs; this README stays scoped to **what Oberyn is** and **what you need to run the client**.
