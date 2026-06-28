import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("rahil_admin_session")?.value;

  // Protect all /writeradmin routes except the login gate itself
  if (pathname.startsWith("/writeradmin")) {
    // If trying to access dashboard/management paths without a session cookie, redirect to login
    if (pathname !== "/writeradmin" && !session) {
      return NextResponse.redirect(new URL("/writeradmin", request.url));
    }

    // If a valid session exists and they try to visit the login landing page, bypass to dashboard
    if (pathname === "/writeradmin" && session) {
      return NextResponse.redirect(new URL("/writeradmin/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/writeradmin/:path*"],
};