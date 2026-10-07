import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// We don't import from @/server/auth/routes because middleware runs in Edge runtime
// and sometimes importing from there causes issues if it imports node modules.
const AUTH_ROUTES = {
  login: "/owner/login",
  accessDenied: "/access-denied",
  scanAgain: "/scan-again",
  notAvailable: "/not-available",
};

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Allow public access to login page
    if (path.startsWith("/owner/login") || path.startsWith("/owner/register") || path.startsWith("/owner/verify") || path.startsWith("/owner/forgot-password") || path.startsWith("/owner/reset-password")) {
      if (token) {
        // If already logged in, redirect to dashboard or appropriate path
        if (token.role === "PLATFORM_ADMIN" || token.role === "PLATFORM_OPS") {
          return NextResponse.redirect(new URL("/ops", req.url));
        }
        return NextResponse.redirect(new URL("/owner", req.url));
      }
      return NextResponse.next();
    }

    if (!token) {
      const url = new URL(AUTH_ROUTES.login, req.url);
      url.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(url);
    }

    const role = token.role as string;
    
    // Check if account is active and not deleted
    if (token.isActive === false || token.deletedAt) {
      return NextResponse.redirect(new URL(AUTH_ROUTES.accessDenied, req.url));
    }

    // Role-based routing
    if (path.startsWith("/ops")) {
      if (role !== "PLATFORM_ADMIN" && role !== "PLATFORM_OPS") {
        return NextResponse.redirect(new URL(AUTH_ROUTES.accessDenied, req.url));
      }
    } else if (path.startsWith("/owner")) {
      if (
        role !== "PLATFORM_ADMIN" &&
        role !== "PLATFORM_OPS" &&
        role !== "OWNER" &&
        role !== "MANAGER"
      ) {
        return NextResponse.redirect(new URL(AUTH_ROUTES.accessDenied, req.url));
      }
    } else if (path.startsWith("/staff")) {
      if (!role) {
        return NextResponse.redirect(new URL(AUTH_ROUTES.accessDenied, req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: [
    "/ops/:path*",
    "/owner/:path*",
    "/staff/:path*",
  ],
};
