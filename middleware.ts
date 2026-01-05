import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token =
    request.cookies.get("__session") ||
    request.cookies.get("firebase:authUser");

  const { pathname } = request.nextUrl;

  const protectedRoutes = [
    "/checkout",
    "/history",
    "/account",
  ];

  const authRoutes = ["/login", "/register"];

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthPage = authRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!token && isProtected) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/checkout/:path*",
    "/history/:path*",
    "/account/:path*",
    "/login",
    "/register",
  ],
};