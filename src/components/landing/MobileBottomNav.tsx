"use client";

import Link from "next/link";
import { Home, BookOpen, Newspaper, UserPlus, Phone } from "lucide-react";
import { usePathname } from "next/navigation";

export default function MobileBottomNav() {
  const pathname = usePathname();

  // Hide on dashboard pages
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  const navItems = [
    { name: "Beranda", href: "/", icon: Home },
    { name: "Program", href: "/#program", icon: BookOpen },
    { name: "Daftar", href: "/#daftar", icon: UserPlus },
    { name: "Blog", href: "/blog", icon: Newspaper },
    { name: "WA", href: "https://wa.me/6283120347713", icon: Phone, external: true },
  ];

  return (
    <div className="lg:hidden fixed bottom-6 left-6 right-6 z-[150]">
      <nav className="bg-white/90 backdrop-blur-xl border border-sky-100 shadow-[0_20px_50px_rgba(2,132,199,0.2)] rounded-[2.5rem] px-4 py-3 flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          if (item.external) {
            return (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 p-2 text-gray-400"
              >
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shadow-sm">
                  <Icon size={20} />
                </div>
              </a>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-2 transition-all duration-300 ${
                isActive ? "text-sky-600 scale-110" : "text-gray-400 hover:text-sky-500"
              }`}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                isActive ? "bg-sky-600 text-white shadow-lg shadow-sky-100" : "bg-gray-50"
              }`}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[8px] font-black uppercase tracking-widest ${isActive ? "opacity-100" : "opacity-0 h-0"}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
