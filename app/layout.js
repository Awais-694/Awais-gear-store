// app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import NavbarUser from "./components/NavbarUser";
import NavbarCart from "./components/NavbarCart";

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
                      href="/?category=Jeans"
                      className="block px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg hover:translate-x-1 transition-all"
                    >
                      👖 Jeans
                    </Link>
                    <Link
                      href="/?category=Caps"
                      className="block px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg hover:translate-x-1 transition-all"
                    >
                      🧢 Caps
                    </Link>
                  </div>
                </div>

                <Link href="/?filter=new" className="hover:text-black transition-colors duration-150">New</Link>
              </div>
            </div>

            {/* Right: Actions and User Status */}
            <div className="flex items-center gap-4">
              {/* Conditional validation checking if dashboard link visibility targets active admin user role */}
              {user && user.role === "admin" && (
                <Link href="/admin" className="text-xs font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100 transition hover:bg-purple-100/50">
                  Admin Panel
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

        {/* 📌 Permanent Structural Footer component template details layout */}
        <footer className="bg-gray-900 text-gray-400 text-center py-8 border-t border-gray-800 text-xs font-medium">
          <p>© 2026 Awais Engineering Core. Protected under HttpOnly Session Cookie Protocol.</p>
        </footer>

      </body>
    </html>
  );
}