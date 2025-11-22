import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("user_token")?.value;

  const protectedRoutes = ["/coins"];

  if (protectedRoutes.some((r) => req.nextUrl.pathname.startsWith(r))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/coins/:path*", "/coins"],
};
