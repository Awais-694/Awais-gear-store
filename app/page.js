import { Suspense } from "react";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import ProductsCatalog from "./components/ProductsCatalog";

// Server side extraction helper: Database token roles decode kerna
async function getAuthenticatedUserRole() {
  const cookieStore = await cookies();
  const token = cookieStore.get("awais_session")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.decode(token);
    return decoded?.role || null;
  } catch (error) {
    return null;
  }
}

export default async function StoreHomePage() {
  // 1. Fetch user identity role & inventory records dataset directly
  const userRole = await getAuthenticatedUserRole();

  let productsList = [];
  try {
    await connectDB();
    const products = await Product.find().sort({ createdAt: -1 });
    productsList = JSON.parse(JSON.stringify(products));
  } catch (err) {
    console.error("Database fetch error:", err);
  }

  return (
    <div className="space-y-8 py-4">
      {/* Hero Store Banner Canvas Segment */}
      <header className="bg-gradient-to-r from-gray-950 to-neutral-900 text-white p-8 rounded-3xl relative overflow-hidden border border-gray-800 shadow-sm">
        <div className="relative z-10 max-w-lg space-y-3">
          <span className="text-[10px] bg-white/10 text-gray-300 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest border border-white/15">
            SUMMER COLLECTION 2026
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
            Minimalist Streetwear & Elite Custom Gear
          </h1>
          <p className="text-xs text-gray-400 font-medium leading-relaxed">
            Premium, comfortable, and specialized apparel designed explicitly for elite developers, designers, and system architects.
          </p>
        </div>
        <div className="absolute top-0 right-0 h-full w-1/3 bg-radial from-white/5 to-transparent pointer-events-none" />
      </header>

      {/* Modern Catalog View Hub */}
      <Suspense fallback={<div className="text-center py-20 text-gray-400 font-bold">Catalog loading...</div>}>
        <ProductsCatalog initialProducts={productsList} userRole={userRole} />
      </Suspense>
    </div>
  );
}