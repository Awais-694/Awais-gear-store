// app/api/products/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import jwt from "jsonwebtoken";

// 🔓 1. GET: Public access node for viewing items catalog
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    
    // Core pagination arithmetic logic
    const page = Number(searchParams.get("page")) || 1;
    const limit = 4; // limit criteria mapping count
    const skip = (page - 1) * limit;

    const products = await Product.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Product.countDocuments();

    return NextResponse.json({
      success: true,
      data: products,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// 🔒 2. POST: Role-Based Secure block to save inventory data items
export async function POST(request) {
  try {
    await connectDB();

    // Verification Layer 1: Check token presence
    const token = request.cookies.get("awais_session")?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized! Token nahi mila." }, { status: 401 });
    }

    // Verification Layer 2: Decrypt signature identity
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verification Layer 3: Role Authorization constraint enforcement check 🛡️
    if (decoded.role !== "admin") {
      return NextResponse.json({ 
        success: false, 
        message: "Access Denied! Sirf Admin hi products create kar sakta hai." 
      }, { status: 403 }); // Forbidden status block
    }

    // Process valid authorization block payload request
    const body = await request.json();
    const { title, description, price, image, stock, category, sizes, colors, isNewProduct } = body;

    if (!title || !description || !price || !image) {
      return NextResponse.json({ success: false, message: "Zaroori fields missing hain!" }, { status: 400 });
    }

    const product = await Product.create({
      title,
      description,
      price: Number(price),
      image, // Cloudinary address link string context
      stock: Number(stock) || 10,
      category: category || "T-Shirt",
      sizes: sizes || [],
      colors: colors || [],
      isNewProduct: !!isNewProduct
    });

    return NextResponse.json({ success: true, message: "Product safely uploaded!", data: product }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Session expired ya verification failure!" }, { status: 401 });
  }
}