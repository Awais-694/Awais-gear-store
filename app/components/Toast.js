"use client";

import { useEffect, useState } from "react";

export default function Toast() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleShowToast = (e) => {
      const { message, type } = e.detail || { message: "", type: "success" };
      setToast({ message, type });
    };

    window.addEventListener("show-toast", handleShowToast);
    return () => window.removeEventListener("show-toast", handleShowToast);
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] animate-fadeIn">
      <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border text-xs font-extrabold transition-all duration-300 max-w-sm ${
        toast.type === "error"
          ? "bg-red-50 text-red-950 border-red-100"
          : "bg-gray-900 text-white border-gray-800"
      }`}>
        <span className="text-base select-none shrink-0">
          {toast.type === "error" ? "⚠️" : "🛒"}
        </span>
        <p className="tracking-wide pr-2">{toast.message}</p>
        <button 
          onClick={() => setToast(null)}
          className="text-gray-400 hover:text-white font-extrabold ml-auto text-[10px] shrink-0"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
