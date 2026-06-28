"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NavbarUser({ user }) {
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        // Force refresh and redirect to login page
        router.push("/login");
        router.refresh();
      } else {
        alert("Logout failed: " + data.message);
      }
    } catch (err) {
      alert("Network error occurred during logout.");
    } finally {
      setLoggingOut(false);
    }
  };

  if (!user) {
    return (
      <Link
        href="/login"
        className="bg-black text-white px-4 py-2 rounded-xl font-bold hover:bg-neutral-900 active:scale-[0.98] transition-all duration-200"
      >
        Sign In
      </Link>
    );
  }

  // Extract a readable name from email
  const displayName = user.email ? user.email.split("@")[0] : "User";

  return (
    <div className="flex items-center gap-1.5 sm:gap-3 bg-gray-50 border border-gray-100 pl-2 sm:pl-3 pr-1.5 sm:pr-2 py-1 sm:py-1.5 rounded-xl hover:bg-gray-100/80 transition-all duration-200 shrink-0">
      <div className="flex items-center gap-1 sm:gap-1.5">
        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
        <span className="text-[10px] sm:text-xs text-gray-700 font-extrabold capitalize select-none max-w-[50px] sm:max-w-[120px] truncate">
          {displayName}
        </span>
      </div>
      
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="bg-white hover:bg-red-50 text-red-600 hover:text-red-700 text-[10px] sm:text-xs font-extrabold px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-gray-200 hover:border-red-200 transition-all duration-150 shadow-sm active:scale-95 disabled:opacity-50 shrink-0"
      >
        {loggingOut ? "..." : "Logout"}
      </button>
    </div>
  );
}
