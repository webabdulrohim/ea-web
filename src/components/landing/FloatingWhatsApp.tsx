"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";

export default function FloatingWhatsApp() {
  const pathname = usePathname();

  // Jangan tampilkan di dashboard admin/tutor/parent
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <a 
      href="https://wa.me/6283120347713" 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-10 right-10 z-[100] bg-green-500 text-white p-5 rounded-full shadow-2xl hover:bg-green-600 transition-all hover:scale-110 active:scale-95 group"
    >
      <MessageCircle size={32} fill="white" />
      <span className="absolute right-full mr-4 bg-white text-green-600 px-4 py-2 rounded-xl font-bold text-sm shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-green-100">
        Tanya Admin (WA)
      </span>
    </a>
  );
}
