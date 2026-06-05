"use client";

import { Instagram, Facebook, Youtube } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Footer() {
  const [logoUrl, setLogoUrl] = useState("/logo.png");

  useEffect(() => {
    axios.get("/api/admin/settings").then(res => {
      if (res.data.logoUrl) setLogoUrl(res.data.logoUrl);
    });
  }, []);

  return (
    <footer className="bg-white py-24 lg:py-32 border-t border-gray-50 relative overflow-hidden transition-colors duration-500">
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-sky-600 via-sky-400 to-sky-600"></div>
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 lg:gap-20 text-center lg:text-left">
          <div className="lg:col-span-2 space-y-8 lg:space-y-10">
            <Link href="/" className="flex items-center justify-center lg:justify-start gap-4 group">
              <div className="relative w-12 h-12 lg:w-16 lg:h-16 overflow-hidden transition-transform duration-500 group-hover:rotate-[10deg]">
                <Image src={logoUrl} alt="EA Logo" fill className="object-contain" />
              </div>
              <span className="text-3xl lg:text-4xl font-black text-gray-950 tracking-tighter uppercase italic">English Action</span>
            </Link>
            <p className="text-lg lg:text-2xl text-gray-400 font-medium leading-relaxed max-w-md mx-auto lg:mx-0 italic">
              Pusat bimbingan belajar multidisiplin yang membantu anak tumbuh berani dan cerdas.
              <span className="block mt-4 lg:mt-6 text-sky-600 font-black uppercase tracking-[0.3em] text-[10px]">Be Brave to Act</span>
            </p>
            <div className="flex justify-center lg:justify-start gap-4 lg:gap-6">
              {[Instagram, Facebook, Youtube].map((Icon, idx) => (
                <Link key={idx} href="#" className="w-12 h-12 lg:w-14 lg:h-14 bg-gray-50 text-gray-400 rounded-xl lg:rounded-2xl flex items-center justify-center hover:bg-sky-600 hover:text-white transition-all duration-500 shadow-sm border border-gray-100">
                  <Icon size={24} />
                </Link>
              ))}
            </div>
          </div>
          
          <div className="space-y-8 lg:space-y-10">
            <h4 className="text-[9px] lg:text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] lg:tracking-[0.4em]">Navigasi</h4>
            <nav className="flex flex-col gap-4 lg:gap-6">
              {['Beranda', 'Tentang Kami', 'Program Belajar', 'Blog & Berita', 'Galeri'].map((item) => (
                <Link key={item} href={item === 'Beranda' ? '/' : `#${item.toLowerCase().split(' ')[0]}`} className="text-base lg:text-lg font-bold text-gray-600 hover:text-sky-600 transition-colors">
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-8 lg:space-y-10">
            <h4 className="text-[9px] lg:text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] lg:tracking-[0.4em]">Kontak</h4>
            <div className="space-y-6 lg:space-y-8">
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-3 lg:gap-4">
                <div className="text-sky-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg></div>
                <p className="text-gray-500 font-medium leading-relaxed text-sm lg:text-base">Lemahabang, Kab. Cirebon</p>
              </div>
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-3 lg:gap-4">
                <div className="text-sky-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg></div>
                <p className="text-gray-500 font-medium text-sm lg:text-base">admin@ea-cirebon.com</p>
              </div>
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-3 lg:gap-4">
                <div className="text-sky-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg></div>
                <p className="text-gray-500 font-medium text-sm lg:text-base">0831 2034 7713</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-20 lg:mt-32 pt-10 lg:pt-12 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6 lg:gap-8">
          <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[9px] lg:text-[10px] text-center">© 2026 English Action. Crafted for Excellence.</p>
          <div className="flex gap-6 lg:gap-10 text-[9px] lg:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
            <Link href="#" className="hover:text-sky-600 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-sky-600 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
