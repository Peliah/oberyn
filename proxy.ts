import { type NextRequest, NextResponse } from "next/server";

/**
 * Next.js 16+ network boundary (replaces `middleware.ts` for this project).
 * App auth lives in the client (localStorage + in-memory private key); this
 * only applies transport hints for sensitive routes. See:
 * https://nextjs.org/docs/app/getting-started/proxy
 */
export function proxy(request: NextRequest) {
  const res = NextResponse.next();
  if (request.nextUrl.pathname.startsWith("/chat")) {
    res.headers.set("Cache-Control", "private, no-store, must-revalidate");
  }
  return res;
}

export const config = {
  matcher: ["/chat/:path*"],
};
