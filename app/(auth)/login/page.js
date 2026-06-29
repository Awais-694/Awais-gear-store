"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginContent() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const redirectUrl = searchParams.get("redirect") || "/";

  const isSignupSuccess = searchParams.get("signup_success") === "true";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg({ type: "", text: "" });

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setStatusMsg({ type: "success", text: data.message || "Login successful!" });
        
        // Dynamic authorization redirection routing rules checks
        setTimeout(() => {
          if (data.user.role === "admin") {
            router.push("/admin"); // If credentials matched admin identity
          } else {
            router.push(redirectUrl); // Route to target redirect url or home
          }
          router.refresh(); // Hard layout context refresh to re-evaluate headers cookies
        }, 1000);
      } else {
        setStatusMsg({ type: "error", text: data.message || "Verification failed!" });
      }
    } catch (error) {
      setStatusMsg({ type: "error", text: "Authentication server connection failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full flex items-center justify-center py-4 px-4 overflow-hidden">
      {/* Decorative premium background blur blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-blue-400/10 blur-3xl pointer-events-none select-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-64 h-64 rounded-full bg-purple-400/10 blur-3xl pointer-events-none select-none"></div>
      
      <div className="w-full max-w-sm bg-white/95 backdrop-blur-md border border-gray-150 p-6 rounded-[1.5rem] shadow-[0_15px_40px_-12px_rgba(0,0,0,0.06)] relative z-10 overflow-hidden transition-all duration-300">
        
        {/* Decorative top gradient accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
 
        <header className="mb-5 text-center">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {isSignupSuccess ? "Welcome Back" : "Sign In"}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {isSignupSuccess ? "Sign in to continue shopping" : "Access your account to start shopping"}
          </p>
        </header>

        {/* Styled inline notification alert box */}
        {statusMsg.text && (
          <div className={`mb-4 p-3 rounded-xl text-xs font-semibold border flex items-center gap-2 animate-fadeIn transition-all duration-300 ${
            statusMsg.type === "success" 
              ? "bg-emerald-50 text-emerald-800 border-emerald-100" 
              : "bg-red-50 text-red-800 border-red-100"
          }`}>
            <span className="text-sm select-none">
              {statusMsg.type === "success" ? "✓" : "⚠"}
            </span>
            <p>{statusMsg.text}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1 pl-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border border-gray-200 bg-white p-2.5 pl-3.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 placeholder-gray-400 font-medium"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1 pl-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full border border-gray-200 bg-white p-2.5 pl-3.5 pr-10 rounded-xl text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 placeholder-gray-400 font-medium"
              />
              <button
                type="button"
                tabIndex="-1"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white p-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-neutral-900 active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Sign In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="relative my-4 text-center">
          <hr className="border-gray-150" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2.5 text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Or</span>
        </div>

        {/* Social login mock button */}
        <button 
          type="button" 
          onClick={() => alert("Social sign-in is currently disabled for this demo.")}
          className="w-full border border-gray-200/80 bg-white hover:bg-gray-50 active:scale-[0.99] text-gray-700 p-2.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.79 5.79 0 0 1 8.2 12.725a5.79 5.79 0 0 1 5.79-5.79c2.51 0 4.17 1.105 5.14 2.03l3.224-3.224C20.35 3.86 17.43 2 13.99 2 8.47 2 4 6.47 4 12s4.47 10 9.99 10c5.82 0 9.87-4.1 9.87-10.02c0-.62-.05-1.22-.16-1.695H12.24Z"/>
          </svg>
          Sign in with Google
        </button>

        <p className="text-xs text-center text-gray-500 mt-5">
          New to Awais Premium Store?{" "}
          <Link href="/signup" className="text-blue-600 font-extrabold hover:text-blue-700 transition-colors">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-500 font-bold">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}