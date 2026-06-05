"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";

export default function OwnerWelcome() {
  const [content, setContent] = useState<any>({
    ownerName: "Owner EA",
    ownerMsg: "Selamat datang di English Action (EA)...",
    ownerImageUrl: ""
  });

  useEffect(() => {
    axios.get("/api/admin/settings").then(res => {
      if (res.data) setContent(res.data);
    }).catch(() => {});
  }, []);

  return (
    <section id="tentang" className="py-24 lg:py-40 bg-white transition-colors relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-sky-50/30 -z-10 skew-x-12 translate-x-1/2 hidden lg:block"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:w-1/2 relative w-full"
          >
            <div className="relative group max-w-2xl mx-auto lg:mx-0">
              {/* Artistic Image Frame */}
              <div className="absolute -inset-2 lg:-inset-4 bg-sky-100 rounded-[3rem] lg:rounded-[5rem] rotate-3 -z-10 group-hover:rotate-0 transition-transform duration-700"></div>
              <div className="w-full h-[400px] md:h-[550px] lg:h-[750px] bg-white rounded-[2.5rem] lg:rounded-[4.5rem] overflow-hidden flex items-center justify-center shadow-ultra transform transition-transform duration-700 border-[8px] lg:border-[12px] border-white relative">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                  style={{ backgroundImage: `url(${content.ownerImageUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80'})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-sky-900/40 via-transparent to-transparent opacity-60"></div>
              </div>
              
              {/* Floating Name Badge */}
              <div className="absolute -bottom-6 -right-4 lg:-bottom-12 lg:-right-12 bg-white p-6 lg:p-12 rounded-[2rem] lg:rounded-[4rem] shadow-ultra border border-sky-50 max-w-[240px] lg:max-w-sm z-20">
                <div className="w-10 lg:w-16 h-1 lg:h-1.5 bg-sky-600 rounded-full mb-4 lg:mb-6"></div>
                <p className="font-black text-xl lg:text-4xl text-gray-950 mb-1 lg:mb-3 tracking-tight leading-none">{content.ownerName}</p>
                <p className="text-sky-600 font-black uppercase tracking-[0.3em] lg:tracking-[0.4em] text-[8px] lg:text-[10px]">Founder & Owner EA</p>
                <div className="mt-4 lg:mt-6 p-3 lg:p-4 bg-sky-50 rounded-xl lg:rounded-2xl border border-sky-100">
                  <p className="text-sky-800 italic font-bold text-[10px] lg:text-sm leading-relaxed">&quot;Be Brave to Act&quot;</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="lg:w-1/2 mt-10 lg:mt-0"
          >
            <h2 className="text-4xl md:text-6xl lg:text-8xl font-black text-gray-950 mb-8 lg:mb-10 leading-[1] lg:leading-[0.9] tracking-[-0.04em]">
              Sambutan Dari <br className="hidden lg:block" />
              <span className="text-sky-600 italic">Owner EA</span>
            </h2>
            
            <div className="space-y-6 lg:space-y-8">
              <p className="text-lg lg:text-2xl text-gray-400 font-medium leading-relaxed italic border-l-4 border-sky-100 pl-6 lg:pl-8">
                {content.ownerMsg}
              </p>
              
              <div className="grid grid-cols-2 gap-4 lg:gap-8 pt-8 lg:pt-12">
                <div className="p-6 lg:p-8 bg-sky-50 rounded-[2rem] lg:rounded-[3rem] border border-sky-100 shadow-sm text-center lg:text-left">
                  <p className="text-3xl lg:text-4xl font-black text-sky-600 mb-1 lg:mb-2">10+</p>
                  <p className="text-[9px] lg:text-xs font-black text-gray-500 uppercase tracking-widest">Tahun Berdiri</p>
                </div>
                <div className="p-6 lg:p-8 bg-gray-50 rounded-[2rem] lg:rounded-[3rem] border border-gray-100 shadow-sm text-center lg:text-left">
                  <p className="text-3xl lg:text-4xl font-black text-gray-950 mb-1 lg:mb-2">500+</p>
                  <p className="text-[9px] lg:text-xs font-black text-gray-500 uppercase tracking-widest">Siswa Berhasil</p>
                </div>
              </div>
              
              <div className="pt-8 lg:pt-10">
                <a href="#daftar" className="flex items-center gap-4 group mx-auto lg:mx-0">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-sky-600 text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl shadow-sky-200">
                    <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </div>
                  <span className="font-black text-gray-950 uppercase tracking-[0.2em] text-[11px] lg:text-sm">Pelajari Selengkapnya</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
