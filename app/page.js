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
      <header className="bg-gradient-to-r from-black via-neutral-900 to-zinc-950 text-white p-8 md:p-12 rounded-3xl relative overflow-hidden shadow-md border border-neutral-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.03),transparent)] pointer-events-none" />
        <div className="relative z-10 max-w-xl space-y-4">
          <span className="inline-block text-[9px] bg-white/10 text-white font-extrabold px-3 py-1 rounded-full uppercase tracking-widest border border-white/10">
            Premium Streetwear Collection
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight uppercase">
            Bold Designs. <br className="hidden md:inline" />Zero Limits.
          </h1>
          <p className="text-xs md:text-sm text-neutral-400 font-medium leading-relaxed max-w-md">
            Express your attitude with premium custom-crafted T-shirts, caps, and minimalist urban gear. Engineered for absolute comfort, tailored for the streets.
          </p>
        </div>
      </header>

      {/* Modern Catalog View Hub */}
      <Suspense fallback={<div className="text-center py-20 text-gray-400 font-bold">Catalog loading...</div>}>
        <ProductsCatalog initialProducts={productsList} userRole={userRole} />
      </Suspense>
    </div>
  );
}