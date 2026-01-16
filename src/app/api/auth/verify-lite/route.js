import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getToken } from "next-auth/jwt";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  try {
    const cookieStore = await cookies();

    /* =====================================================
       1. MANUAL JWT (Credentials Login)
       ===================================================== */
    const manualToken = cookieStore.get("authToken")?.value;

    if (manualToken && JWT_SECRET) {
      try {
        const decoded = jwt.verify(manualToken, JWT_SECRET);

        return NextResponse.json({
          authenticated: true,
          authType: "credentials",
          userType: decoded.userType,
        });
      } catch (err) {
        // Invalid or expired manual JWT → fall through
      }
    }

    /* =====================================================
       2. NEXTAUTH (Google OAuth)
       ===================================================== */
    const nextAuthToken = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (nextAuthToken) {
      return NextResponse.json({
        authenticated: true,
        authType: "google",
        userType: nextAuthToken.userType ?? "student", // fallback if needed
      });
    }

    /* =====================================================
       3. NOT AUTHENTICATED
       ===================================================== */
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );

  } catch (error) {
    console.error("verify-lite error:", error);
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }
}
