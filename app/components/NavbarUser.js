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
    <div className="flex items-center gap-4 bg-gray-50 border border-gray-150 pl-3 pr-2 py-1.5 rounded-xl hover:bg-gray-100/80 transition-all duration-200">
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="text-xs text-gray-700 font-extrabold capitalize select-none">
          👤 {displayName}
        </span>
      </div>
      
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="bg-white hover:bg-red-50 text-red-600 hover:text-red-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-200 hover:border-red-200 transition-all duration-150 shadow-sm active:scale-95 disabled:opacity-50"
      >
        {loggingOut ? "Leaving..." : "Logout"}
      </button>
    </div>
  );
}
