import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import HowItWorks from "./components/HowItWorks";

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
      {/* Wohven-Inspired Modern Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#f4f6f2] p-4 sm:p-6 rounded-[32px] items-stretch overflow-hidden border border-neutral-200/50">
        
        {/* Left Side: Premium 4-Image Asymmetric Grid Collage */}
        <div className="lg:col-span-7 grid grid-cols-4 grid-rows-2 gap-3 min-h-[400px] sm:min-h-[520px]">
          
          {/* Main Large Image (Green T-Shirt) - Spans 2 cols, 2 rows */}
          <div className="col-span-2 row-span-2 relative overflow-hidden rounded-2xl group shadow-sm">
            <img
              src="/hero1.jpg"
              alt="Barakah Mindset Premium Streetwear"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
            <span className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm text-black text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
              Collection 01
            </span>
          </div>

          {/* Medium Image (Blue T-Shirt) - Spans 2 cols, 1 row */}
          <div className="col-span-2 row-span-1 relative overflow-hidden rounded-2xl group shadow-sm">
            <img
              src="/hero2.jpg"
              alt="Minimalist T-Shirt Design"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
            <span className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm text-black text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
              New Wave
            </span>
          </div>

          {/* Small Image A (White T-Shirt) - Spans 1 col, 1 row */}
          <div className="col-span-1 row-span-1 relative overflow-hidden rounded-2xl group shadow-sm">
            <img
              src="/hero3.jpg"
              alt="Urban Streetwear"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
          </div>

          {/* Small Image B (4th T-Shirt) - Spans 1 col, 1 row */}
          <div className="col-span-1 row-span-1 relative overflow-hidden rounded-2xl group shadow-sm">
            <img
              src="/hero4.jpg"
              alt="Custom Streetwear Edition"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
          </div>
        </div>

        {/* Right Side: Cozy Minimalist Text Card */}
        <div className="lg:col-span-5 bg-[#e4e8e1] rounded-2xl p-8 sm:p-12 flex flex-col justify-center space-y-6 shadow-sm border border-[#d8dcd5]">
          <span className="text-[10px] bg-black/5 text-neutral-800 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider self-start border border-black/5">
            Premium Streetwear
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-900 leading-[1.1] uppercase">
            Not too showy. <br />
            Not too stuffy. <br />
            Not too anything.
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 font-medium leading-relaxed">
            Designed by a new artist every month and delivered straight to you at a great price. It's never been easier to look good.
          </p>
          <Link
            href="/collections/all-goods"
            className="inline-block bg-black hover:bg-neutral-800 text-white text-[11px] font-black uppercase tracking-wider py-4 px-8 rounded-xl transition-all duration-150 text-center self-start hover:shadow-md active:scale-[0.98]"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* How It Works Stepper Section */}
      <HowItWorks />

      {/* Trends Showcase Gallery Section */}
      <div className="space-y-8 py-12 border-t border-neutral-200/50">
        <div className="max-w-4xl mx-auto text-center px-4">
          <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-neutral-800 leading-relaxed font-sans max-w-3xl mx-auto">
            Trends come and go but your shirts don't have to. Our artists make sure you look great today, tomorrow and into the next decade.
          </p>
        </div>

        {/* High-Resolution Flat-lay Showcase Banner */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative w-full rounded-[24px] overflow-hidden border border-neutral-200/40 shadow-md group">
            <img
              src="/showcase_banner.jpg"
              alt="T-Shirt Collection Grid Showcase"
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.01]"
            />
          </div>
        </div>
      </div>

      {/* Built to Our High Standards Section */}
      <div className="space-y-8 py-8 border-t border-neutral-200/50">
        <div className="max-w-2xl">
          <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 uppercase tracking-tight">
            Built to our high standards
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Premium Fabric */}
          <div className="space-y-4 group">
            <div className="relative aspect-square overflow-hidden rounded-[24px] bg-neutral-100 border border-neutral-200/40">
              <img
                src="/hero7.jpg"
                alt="Premium Fabric Close-up"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="space-y-2 px-1">
              <h3 className="text-xl font-black text-neutral-900 uppercase tracking-tight">
                Premium Fabric
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 font-medium leading-relaxed">
                Super soft ringspun cotton is the star of our tees, offering unparalleled comfort and durability.
              </p>
            </div>
          </div>

          {/* Card 2: Comfort Collar */}
          <div className="space-y-4 group">
            <div className="relative aspect-square overflow-hidden rounded-[24px] bg-neutral-100 border border-neutral-200/40">
              <img
                src="/hero8.jpg"
                alt="Comfort Collar Detail"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="space-y-2 px-1">
              <h3 className="text-xl font-black text-neutral-900 uppercase tracking-tight">
                Comfort Collar
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 font-medium leading-relaxed">
                Our tagless, finely ribbed collar will hold its shape wear after wear without scratching.
              </p>
            </div>
          </div>

          {/* Card 3: Forever Print */}
          <div className="space-y-4 group">
            <div className="relative aspect-square overflow-hidden rounded-[24px] bg-neutral-100 border border-neutral-200/40">
              <img
                src="/hero9.jpg"
                alt="Forever Print Detail"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="space-y-2 px-1">
              <h3 className="text-xl font-black text-neutral-900 uppercase tracking-tight">
                Forever Print
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 font-medium leading-relaxed">
                High-quality water-based inks mean our graphics stay vibrant, soft to the touch, and never crack.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}