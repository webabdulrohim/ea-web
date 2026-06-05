"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu, X } from "lucide-react";

export default function DashboardShell({
  children,
  role,
  userName,
}: {
  children: React.ReactNode;
  role: string;
  userName: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden transition-colors">
      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-[120] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`fixed lg:static inset-y-0 left-0 z-[130] transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <Sidebar role={role} />
      </div>

      <main className="flex-1 overflow-y-auto relative">
        {/* Mobile Header */}
        <header className="sticky top-0 z-[100] bg-white/80 backdrop-blur-md border-b border-gray-100 lg:hidden flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center text-white shadow-lg font-black italic">EA</div>
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-950"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
          {/* Desktop Header Content (already in main content) */}
          <header className="mb-10 flex justify-between items-center">
            <div>
              <h2 className="text-[10px] lg:text-xs font-black text-sky-600 uppercase tracking-[0.3em] mb-2 lg:mb-3">Panel {role}</h2>
              <p className="text-2xl lg:text-4xl font-black text-gray-950 tracking-tighter italic">Halo, <span className="text-sky-600">{userName}</span>!</p>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <div className="w-12 lg:w-14 h-12 lg:h-14 bg-white rounded-2xl flex items-center justify-center text-sky-600 font-black border border-gray-100 shadow-premium">
                {userName?.[0]}
              </div>
            </div>
          </header>
          {children}
        </div>
      </main>
    </div>
  );
}
