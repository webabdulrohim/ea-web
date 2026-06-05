"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ArrowRight, UserCircle } from "lucide-react";
import Image from "next/image";
import axios from "axios";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState("/logo.png");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    axios.get("/api/admin/settings").then(res => {
      if (res.data.logoUrl) setLogoUrl(res.data.logoUrl);
    });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-[100] transition-all duration-700 
      ${scrolled 
        ? "py-3 bg-white lg:bg-white/90 lg:backdrop-blur-2xl shadow-ultra" 
        : "py-6 lg:py-10 bg-white lg:bg-transparent shadow-md lg:shadow-none"
      }`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 lg:gap-4 group">
          <div className="relative w-12 h-12 lg:w-16 lg:h-16 overflow-hidden transition-transform duration-500 group-hover:rotate-[10deg]">
            <Image 
              src={logoUrl} 
              alt="English Action Logo" 
              fill 
              className="object-contain"
              priority
            />
          </div>
          <span className={`hidden sm:inline text-2xl lg:text-3xl font-black text-gray-950 tracking-tighter uppercase italic`}>English Action</span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8 xl:gap-10 bg-white/40 backdrop-blur-md px-10 py-5 rounded-full border border-white/50 shadow-sm">
          {['Beranda', 'Tentang', 'Program', 'Blog', 'Galeri'].map((item) => (
            <Link 
              key={item} 
              href={item === 'Beranda' ? '/' : item === 'Blog' ? '/blog' : `/#${item.toLowerCase()}`}
              className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-sky-600 transition-all duration-300 hover:scale-110 active:scale-95"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Navbar Buttons (Desktop) */}
        <div className="hidden lg:flex items-center gap-4">
          <Link href="/login" className="bg-sky-600 text-white px-8 py-4 rounded-full font-black text-[10px] tracking-[0.3em] hover:shadow-ultra transition-all duration-500 scale-105 active:scale-95 uppercase flex items-center gap-2">
            <UserCircle size={16} /> Login System
          </Link>
        </div>

        {/* Mobile Menu Toggle & Single Button */}
        <div className="flex lg:hidden items-center gap-4">
          <Link href="/login" className="bg-sky-600 text-white px-6 py-2.5 rounded-full font-black text-[9px] tracking-widest shadow-lg active:scale-95">
            LOGIN
          </Link>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 bg-white rounded-xl shadow-premium border border-gray-100 flex items-center justify-center text-sky-600 active:scale-90 transition-transform"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`lg:hidden fixed inset-0 bg-white z-[110] transition-all duration-500 ease-in-out transform ${mobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"}`}>
        <div className="p-6 flex justify-between items-center border-b border-gray-50">
          <div className="text-2xl font-black text-gray-950 flex items-center gap-3 uppercase italic tracking-tighter">
            <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center text-white text-lg">EA</div>
            Menu
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center"><X size={20} /></button>
        </div>
        <div className="p-8 flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-100px)]">
          {['Beranda', 'Tentang', 'Program', 'Blog', 'Galeri'].map((item) => (
            <Link 
              key={item} 
              href={item === 'Beranda' ? '/' : item === 'Blog' ? '/blog' : `/#${item.toLowerCase()}`}
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl font-black text-gray-950 uppercase tracking-tighter flex items-center justify-between group py-2"
            >
              {item}
              <div className="w-8 h-8 bg-sky-50 text-sky-600 rounded-lg flex items-center justify-center group-active:scale-125 transition-transform"><ArrowRight size={16} /></div>
            </Link>
          ))}
          
          {/* Nav Buttons (Mobile Menu) */}
          <div className="mt-8 flex flex-col gap-4">
            <Link 
              href="/#daftar" 
              onClick={() => setMobileMenuOpen(false)}
              className="bg-white text-sky-600 border-2 border-sky-600 p-6 rounded-[2rem] font-black text-center text-lg uppercase tracking-widest shadow-sm active:scale-95 transition-transform"
            >
              DAFTAR SEKARANG
            </Link>
            <Link 
              href="/login" 
              onClick={() => setMobileMenuOpen(false)}
              className="bg-sky-600 text-white p-6 rounded-[2rem] font-black text-center text-lg uppercase tracking-widest shadow-xl shadow-sky-100 flex items-center justify-center gap-3 active:scale-95 transition-transform"
            >
              <UserCircle size={24} /> LOGIN SYSTEM
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
