// app/admin/layout.js
import Link from "next/link";

export default function AdminConsoleLayout({ children }) {
  return (
    <div className="flex flex-col md:flex-row gap-6 min-h-[70vh] py-4">
      
      {/* 📊 Admin Console Workspace Control Menu Sidebar */}
      <aside className="w-full md:w-64 bg-gray-900 text-white rounded-3xl p-6 flex flex-col justify-between border border-gray-800 shadow-sm shrink-0">
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-black uppercase text-blue-400 tracking-wider">Admin Engine</h2>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">Awais Gear System Store Management v1.0</p>
          </div>
          
          <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 font-bold text-xs">
            <Link 
              href="/admin" 
              className="px-4 py-3 bg-gray-800 rounded-xl hover:text-blue-400 transition block text-center md:text-left whitespace-nowrap flex-1 md:flex-none"
            >
              📊 Core Overview
            </Link>
            <Link 
              href="/admin#upload-section" 
              className="px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-xl hover:text-blue-400 transition block text-center md:text-left whitespace-nowrap flex-1 md:flex-none"
            >
              ➕ Upload Merchandise
            </Link>
          </nav>
        </div>

        <div className="hidden md:block border-t border-gray-800 pt-4 text-[10px] font-mono text-gray-500 font-medium">
          Secure Tunnel Connection Verified
        </div>
      </aside>

      {/* 📦 Dynamic Control Panels Views Rendering Viewport */}
      <main className="flex-1 bg-white border border-gray-100 p-6 md:p-8 rounded-3xl shadow-sm">
        {children}
      </main>

    </div>
  );
}