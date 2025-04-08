import { NextResponse } from "next/server";

// Add any public routes that don't require authentication
const publicRoutes = ["/auth/login", "/auth/signup"];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check for auth token
  const token = request.cookies.get("accessToken");

  // If accessing dashboard without token, redirect to login
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // If authenticated user tries to access auth pages, redirect to dashboard
  if (token && publicRoutes.includes(pathname)) {
    const dashboardUrl = new URL("/dashboard/overview", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    // Protect all dashboard routes
    "/dashboard/:path*",
    // Protect auth routes from authenticated users
    "/auth/:path*",
  ],
};
