import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;
  console.log("Token: " + token);
  const isAuth = !!token;

  const { pathname, search } = req.nextUrl;

  const publicPages = [
    "/",
    "/login",
    "/register",
    "/verify-otp",
    "/emailVerification",
    "/passwordReset",
  ];

  // If user is not authenticated and tries to access protected routes
  if (!isAuth && !publicPages.includes(pathname)) {
    const loginUrl = new URL("/login", req.url);

    // Append the current path (with query string) as a redirect URL
    loginUrl.searchParams.set("redirect", pathname + search);

    return NextResponse.redirect(loginUrl);
  }

  // Allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|login|register|verify-otp|emailVerification|passwordReset).*)",
  ],
};
