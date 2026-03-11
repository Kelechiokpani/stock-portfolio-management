import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 1. Get the token from cookies
  // Replace 'token' with whatever your cookie name is (e.g., 'access_token' or 'next-auth.session-token')
  const token = request.cookies.get("token")?.value;

  const { pathname } = request.nextUrl;

  // 2. Define protected routes
  const isDashboardPage = pathname.startsWith("/dashboard");
  const isAdminPage = pathname.startsWith("/admin");

  // 3. If no token and trying to access protected routes -> Redirect to Login
  if ((isDashboardPage || isAdminPage) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 4. (Optional) If user is logged in and tries to go to /login -> Redirect to Dashboard
  // if (pathname === "/login" && token) {
  //   // Redirect logged-in users AWAY from the login page to the dashboard
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  return NextResponse.next();
}

// 5. Matcher: Only run middleware on these paths
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login"],
};
