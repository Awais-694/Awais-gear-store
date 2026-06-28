// middleware.js
import { NextResponse } from "next/server";
import * as jose from "jose"; // Lightweight edge validation package

export async function middleware(request) {
  // 1. Browser cookies se token extract karein
  const token = request.cookies.get("awais_session")?.value;
  const currentPath = request.nextUrl.pathname;

  // 2. Verification rules criteria paths map karein
  const isAdminPath = currentPath.startsWith("/admin");
  const isAuthPage = currentPath.startsWith("/login") || currentPath.startsWith("/signup");

  // 🔴 RULE 1: Admin block request verification
  if (!token && isAdminPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token) {
    try {
      // Secret key encoder setup string parameters
      const secretString = new TextEncoder().encode(process.env.JWT_SECRET);
      
      // Token signature parameters decrypt logic node 🛡️
      const { payload } = await jose.jwtVerify(token, secretString);

      // Authorization control check (RBAC protection)
      if (isAdminPath && payload.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url)); // Kicked out simple users
      }

      // Bypass condition for active session access login/signup screens
      if (isAuthPage) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (err) {
      // Token mismatch or expired conditions
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("awais_session"); // session clear parameters tracking
      return response;
    }
  }

  return NextResponse.next();
}

// Global active routes targets mapping config tracker
export const config = {
  matcher: ["/admin/:path*", "/login", "/signup"],
};