import { Suspense } from "react";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import ProductsCatalog from "../../components/ProductsCatalog";

export const revalidate = 0; // Dynamic server rendering

// Extract user identity role from database session cookies
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

export default async function AllGoodsPage() {
  const userRole = await getAuthenticatedUserRole();
  let productsList = [];
  
  try {
    await connectDB();
    // Fetch all products to pass to the ProductsCatalog filter system
    const products = await Product.find().sort({ createdAt: -1 });
    productsList = JSON.parse(JSON.stringify(products));
  } catch (err) {
    console.error("Database fetch error on all-goods page:", err);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header Info - Upgraded larger fonts */}
      <div className="space-y-4 max-w-4xl">
        <span className="inline-block text-[11px] bg-black text-white font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
          Our Collection
        </span>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-neutral-900 uppercase tracking-tight leading-[1.05]">
          Choose A Style
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-neutral-600 font-medium leading-relaxed">
          You'll receive this style with a new graphic designed by one of our talented artists. Don't stress, you can change your style at any time after you've signed up.
        </p>
      </div>

      {/* Render the Full Products Catalog (with Filters, Search and Grid) */}
      <Suspense fallback={<div className="text-center py-20 text-gray-400 font-bold">Catalog loading...</div>}>
        <ProductsCatalog initialProducts={productsList} userRole={userRole} />
      </Suspense>
    </div>
  );
}
