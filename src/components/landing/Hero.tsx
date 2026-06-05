"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowRight, Star } from "lucide-react";

export default function Hero() {
  const [content, setContent] = useState<any>({
    heroTitle: "EA - English Action",
    heroDesc: "Be Brave to Act",
    heroImageUrl: ""
  });

  useEffect(() => {
    axios.get("/api/admin/settings").then(res => {
      if (res.data) setContent(res.data);
    }).catch(() => {});
  }, []);

  return (
    <section className="relative bg-white pt-32 pb-16 lg:pt-56 lg:pb-40 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-[-15%] right-[-5%] w-[400px] lg:w-[800px] h-[400px] lg:h-[800px] bg-sky-50 rounded-full blur-[100px] lg:blur-[160px] opacity-70 animate-pulse-soft"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[350px] lg:w-[700px] h-[350px] lg:h-[700px] bg-sky-100/30 rounded-full blur-[80px] lg:blur-[140px] opacity-50"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="lg:w-3/5 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-md px-5 lg:px-6 py-2.5 lg:py-3 rounded-2xl font-black text-[9px] lg:text-[11px] uppercase tracking-[0.3em] lg:tracking-[0.4em] mb-8 lg:mb-12 border border-sky-100 shadow-ultra text-sky-600"
            >
              <div className="w-1.5 h-1.5 lg:w-2 h-2 bg-sky-600 rounded-full animate-ping"></div>
              Bimbingan Belajar Multidisiplin
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-7xl lg:text-[130px] font-black text-gray-950 leading-[0.9] lg:leading-[0.85] mb-8 lg:mb-12 tracking-[-0.05em]"
            >
              {content.heroTitle.split(" - ").map((part: string, i: number) => (
                <span key={i} className="block last:text-sky-600 last:italic">
                  {part}
                </span>
              ))}
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg lg:text-3xl text-gray-400 mb-10 lg:mb-16 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed italic border-l-2 lg:border-l-4 border-sky-200 pl-6 lg:pl-8"
            >
              &quot;{content.heroDesc}&quot;
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row gap-4 lg:gap-8 justify-center lg:justify-start"
            >
              <Link 
                href="#daftar"
                className="group relative inline-flex items-center justify-center bg-sky-600 text-white font-black py-5 lg:py-7 px-10 lg:px-14 rounded-3xl lg:rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95"
              >
                <div className="absolute inset-0 bg-sky-700 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <span className="relative z-10 flex items-center gap-3 lg:gap-4 uppercase tracking-[0.2em] text-[10px] lg:text-xs">
                  Daftar Sekarang <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-500" />
                </span>
              </Link>
              <Link 
                href="#program"
                className="inline-flex items-center justify-center bg-sky-50 text-sky-600 font-black py-5 lg:py-7 px-10 lg:px-14 rounded-3xl lg:rounded-[2.5rem] border-2 border-sky-100 hover:bg-sky-600 hover:text-white transition-all duration-500 shadow-premium uppercase tracking-[0.2em] text-[10px] lg:text-xs active:scale-95"
              >
                Eksplor Program
              </Link>
            </motion.div>
          </div>

          <div className="lg:w-2/5 flex justify-center mt-12 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="w-64 h-80 lg:w-[550px] lg:h-[700px] bg-gray-100 rounded-[4rem] lg:rounded-[6rem] overflow-hidden shadow-ultra border-[10px] lg:border-[15px] border-white relative group">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                  style={{ backgroundImage: `url(${content.heroImageUrl || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80'})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 to-transparent"></div>
                <div className="absolute bottom-10 left-10 lg:bottom-16 lg:left-16 text-white">
                   <p className="font-black text-3xl lg:text-5xl leading-tight uppercase italic tracking-tighter">Be Brave<br /><span className="text-sky-400">to Act</span></p>
                </div>
              </div>

              {/* High-End Floating Badge */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 lg:-top-12 lg:-right-12 bg-white p-4 lg:p-8 rounded-[2rem] lg:rounded-[3.5rem] shadow-ultra border border-sky-50 flex items-center gap-3 lg:gap-6 group hover:scale-110 transition-transform cursor-pointer z-20"
              >
                <div className="bg-sky-600 p-2.5 lg:p-4.5 rounded-xl lg:rounded-3xl text-white shadow-xl shadow-sky-200">
                  <Star fill="currentColor" size={20} />
                </div>
                <div>
                   <p className="font-black text-xl lg:text-3xl text-gray-950 leading-none mb-1 lg:mb-1.5">Top <span className="text-sky-600 italic">Rated</span></p>
                   <p className="text-[8px] lg:text-[11px] text-gray-400 font-black uppercase tracking-[0.2em] lg:tracking-[0.3em]">Cirebon Education</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
