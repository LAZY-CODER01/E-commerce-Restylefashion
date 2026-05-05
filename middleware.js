import { NextResponse } from "next/server";

/**
 * Legacy /login and /signup routes → /auth with `next=` (formerly `redirect=`).
 */
export function middleware(request) {
  const path = request.nextUrl.pathname;
  const base = path.replace(/\/+$/, "") || "/";
  if (base !== "/login" && base !== "/signup") {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/auth";

  const legacy = url.searchParams.get("redirect");
  if (legacy && !url.searchParams.get("next")) {
    url.searchParams.set("next", legacy);
  }
  url.searchParams.delete("redirect");

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/login", "/login/:path*", "/signup", "/signup/:path*"],
};
