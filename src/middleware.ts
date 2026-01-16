import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { jwtVerify } from "jose";//It runs in edge runtime (suitable for middleware) without relying on node built-in modules like jsonwebtoken


export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

   if (
  pathname.startsWith("/student-dashboard") ||
  pathname.startsWith("/teacher-dashboard")
) {
  return NextResponse.next();
}


  /* =====================================================
     ADMIN ROUTE PROTECTION 
     ===================================================== */

  if (pathname.startsWith("/admin")) {
    const adminToken = req.cookies.get("admin_token")?.value || "";

    // Accessing admin routes without token
    if (!adminToken && pathname !== "/admin/login") {
      return NextResponse.redirect(
        new URL("/admin/login", req.url)
      );
    }

    // Accessing admin login while already logged in
    if (adminToken && pathname === "/admin/login") {
      return NextResponse.redirect(
        new URL("/admin/adminDashboard", req.url)
      );
    }
  }

//   /* =====================================================
//      USER LOGIN / REGISTER ROUTES ONLY
//      ===================================================== */
 
//   const authPages =
//   pathname.startsWith("/login") ||
//   pathname.startsWith("/register");

// if (!authPages) {
//   return NextResponse.next();
// }

//   /* -----------------------------------------
//      1. Check NextAuth session (Google OAuth)
//      ----------------------------------------- */
//   const nextAuthToken = await getToken({
//     req,
//     secret: process.env.NEXTAUTH_SECRET,
//   });

//   if (nextAuthToken) {
//     if (nextAuthToken.userType === "student") {
//       return NextResponse.redirect(
//         new URL("/student-dashboard", req.url)
//       );
//     } else {
//       return NextResponse.redirect(
//         new URL("/teacher-dashboard", req.url)
//       );
//     }
//   }


  return NextResponse.next();
 }

export const config = {
  matcher: [
    // "/login",
    // "/register",
    "/admin/:path*",
  ],
};
