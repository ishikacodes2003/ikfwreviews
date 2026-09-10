import { NextRequest, NextResponse } from "next/server";

export default function proxy(request: NextRequest) {
  if (!request.cookies.get("ikfw_session")?.value) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/write-review/:path*"] };
