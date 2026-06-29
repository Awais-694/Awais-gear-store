// app/api/products/[id]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import jwt from "jsonwebtoken";

// Helper function to check if the user is authenticated as admin
async function verifyAdmin(request) {
  const token = request.cookies.get("awais_session")?.value;
  if (!token) return false;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.role === "admin";
  } catch (error) {
    return false;
  }
}

// 🔓 1. GET: Fetch a single product by ID
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ success: false, message: "Product nahi mila!" }, { status: 444 });
    }
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// 🔒 2. PUT: Update product by ID (Admin only)
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ success: false, message: "Access Denied! Sirf Admin hi edit kar sakta hai." }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, description, price, image, stock, category, sizes, colors, isNewProduct } = body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        title,
        description,
        price: Number(price),
        image,
        stock: Number(stock),
        category,
        sizes,
        colors,
        isNewProduct: !!isNewProduct
      },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ success: false, message: "Product update nahi ho saka!" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Product updated successfully!", data: updatedProduct });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// 🔒 3. DELETE: Remove product by ID (Admin only)
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ success: false, message: "Access Denied! Sirf Admin hi delete kar sakta hai." }, { status: 403 });
    }

    const { id } = await params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ success: false, message: "Product delete nahi ho saka!" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Product safely removed from inventory cluster!" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
