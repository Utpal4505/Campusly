import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Protected routes requiring an active Better Auth session.
 */
const PROTECTED_PREFIXES = [
  "/feed",
  "/messages",
  "/people",
  "/profile",
  "/tickets",
  "/clubs/register",
  "/onboarding",
];

/**
 * Authentication routes.
 */
const AUTH_ROUTES = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Better Auth stores session token in either standard or __Secure prefixed cookie
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  const isAuthenticated = Boolean(sessionToken);

  // 1. Check if the current route is protected
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isProtected && !isAuthenticated) {
    const destination = pathname + search;
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", destination);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If already authenticated and visiting /login or /register, fast-forward unless explicitly switching
  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  if (isAuthRoute && isAuthenticated && !request.nextUrl.searchParams.has("switch")) {
    const redirectParam = request.nextUrl.searchParams.get("redirect");
    const target = redirectParam || "/feed";
    return NextResponse.redirect(new URL(target, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static assets)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     * - static files with extensions (e.g. .svg, .png, .jpg, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.[\\w]+$).*)",
  ],
};
