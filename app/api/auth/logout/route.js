import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logged out successfully!" });
  
  response.cookies.set("awais_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0), // Set expiry date in the past to immediately clear the cookie
    path: "/",
  });

  return response;
}
