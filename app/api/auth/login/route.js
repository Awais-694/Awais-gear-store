// app/api/auth/login/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are both required!" }, { status: 400 });
    }

    // 1. Dhoondo user ko
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ success: false, message: "Invalid email address or password. Please try again." }, { status: 401 });
    }

    // 2. Verify hashed password comparison 🔑
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: "Invalid email address or password. Please try again." }, { status: 401 });
    }

    // 3. Create Session Payload Matrix
    const tokenPayload = {
      id: user._id,
      email: user.email,
      role: user.role, // Core field for Role-Based Access Control
    };

    // 4. Encrypt Sign Process
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "7d" });

    const response = NextResponse.json({
      success: true,
      message: `Welcome back ${user.name}!`,
      user: { name: user.name, email: user.email, role: user.role }
    });

    // 5. HttpOnly Safe Cookie Delivery 🛡️
    response.cookies.set("awais_session", token, {
      httpOnly: true, // Crucial shield against cross-site scripting (XSS)
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 din ka lifetime session
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}