// app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import NavbarUser from "./components/NavbarUser";
import NavbarCart from "./components/NavbarCart";
import Toast from "./components/Toast";
import ScrollReveal from "./components/ScrollReveal";

const interFont = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "⚡ Awais Premium Gear Store",
  description: "Secure production engine for selling custom tech gear and t-shirts.",
};

export default async function RootLayout({ children }) {
  // Server-side check user credentials identity session mapping for nav layout items change
  const cookieStore = await cookies();
  const token = cookieStore.get("awais_session")?.value;
  
  let user = null;
  if (token) {
    try {
      user = jwt.decode(token); // Direct user metrics parameters read context
    } catch (e) {
      user = null;
    }
  }

  return (
    <html lang="en">
      <body className={`${interFont.className} bg-gray-50 text-gray-900 min-h-screen flex flex-col`}>
        
        {/* 📌 Shared Responsive Top Navigation Hub */}
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            
            {/* Left: Navigation links */}
            <div className="flex items-center gap-8">
              <Link href="/" className="text-xl font-black tracking-widest text-black uppercase">
                AWAIS
              </Link>
              <div className="hidden md:flex items-center gap-6 font-bold text-xs uppercase tracking-wider text-gray-500">
                <Link href="/" className="hover:text-black transition-colors duration-150">Home</Link>
                
                {/* Collections CSS Hover Dropdown Menu */}
                <div className="relative group">
                  <button className="hover:text-black transition-colors duration-150 flex items-center gap-1 font-bold text-xs uppercase tracking-wider text-gray-500 cursor-pointer select-none">
                    Collections 
                    <span className="inline-block transition-transform duration-200 group-hover:rotate-180 text-[8px] ml-0.5">
                      ▼
                    </span>
                  </button>
                  <div className="absolute left-0 mt-2.5 w-52 bg-white text-gray-800 rounded-2xl shadow-xl py-3.5 px-2 border border-gray-100 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
                    <Link
                      href="/?category=T-Shirt"
                      className="block px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg hover:translate-x-1 transition-all"
                    >
                      👕 T-Shirts
                    </Link>
                    <Link
                      href="/?category=Hoodie"
                      className="block px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg hover:translate-x-1 transition-all"
                    >
                      🧥 Hoodies
                    </Link>
                    <Link
                      href="/?category=Caps"
                      className="block px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg hover:translate-x-1 transition-all"
                    >
                      🧢 Caps
                    </Link>
                  </div>
                </div>

                <Link href={user && user.role === "admin" ? "/admin" : "/?filter=new"} className="hover:text-black transition-colors duration-150">New</Link>
              </div>
            </div>

            {/* Right: Actions and User Status */}
            <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
              {/* Conditional validation checking if dashboard link visibility targets active admin user role */}
              {user && user.role === "admin" && (
                <Link href="/admin" className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-purple-100 transition hover:bg-purple-100/50 shrink-0">
                  Admin
                </Link>
              )}

              {/* Shopping Cart Trigger */}
              {user && user.role !== "admin" && <NavbarCart />}

              {/* Dynamic authentication state changes visualization items node */}
              <NavbarUser user={user} />
            </div>
          </div>
        </nav>

        {/* 📦 Dynamic Rendering viewport container slots */}
        <main className="flex-grow max-w-7xl mx-auto px-6 py-8 w-full">
          {children}
        </main>

        {/* 📌 Professional Multi-Column Store Footer (Dark Premium Theme) */}
        <footer className="bg-neutral-950 border-t border-neutral-900 py-12 mt-16 text-neutral-400">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <h4 className="text-xs font-black tracking-widest text-white uppercase">AWAIS PREMIUM</h4>
              <p className="text-[11px] leading-relaxed max-w-xs text-neutral-400 font-medium">
                Your premium destination for custom streetwear, t-shirts, and minimalist fashion items built with premium quality materials.
              </p>
            </div>
            <div className="space-y-2 text-[11px] font-bold uppercase tracking-wider">
              <h4 className="text-xs font-black text-white mb-2 tracking-wider">QUICK LINKS</h4>
              <div className="flex flex-col gap-2">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <Link href="/?filter=new" className="hover:text-white transition-colors">New Arrivals</Link>
                <Link href="/?category=T-Shirt" className="hover:text-white transition-colors">T-Shirts</Link>
              </div>
            </div>
            <div className="space-y-3 text-[11px] font-medium text-neutral-400">
              <h4 className="text-xs font-black text-white uppercase tracking-wider">SECURE SHOPPING</h4>
              <p className="leading-relaxed">
                Safe payment processing, fast worldwide delivery, and dedicated customer support.
              </p>
              <div className="text-[10px] text-neutral-500 font-medium pt-1">
                © {new Date().getFullYear()} Awais Premium Store. All Rights Reserved.
              </div>
            </div>
          </div>
        </footer>

        {/* Global Toast Notification System */}
        <Toast />

        {/* Global Scroll Animation Trigger System */}
        <ScrollReveal />

      </body>
    </html>
  );
}