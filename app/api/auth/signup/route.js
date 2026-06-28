// app/api/auth/signup/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, password } = body;

    // 1. Basic validation
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: "Tamam fields fill karein!" }, { status: 400 });
    }

    // 2. Check duplicate email
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return NextResponse.json({ success: false, message: "Yeh email pehle se registered hai!" }, { status: 400 });
    }

    // 3. Password Secure Hashing 🛡️
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Role Assignment Logic
    // Agar email aapka admin email hai, to system role 'admin' set karega
    const assignRole = email.toLowerCase() === "awaisadmin@store.com" ? "admin" : "user";

    await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: assignRole,
    });

    return NextResponse.json({ success: true, message: "Account successfully create ho gaya!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}