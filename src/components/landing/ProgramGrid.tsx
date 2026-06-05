"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import { Book, Calculator, PenTool, Hash, Baby, HelpCircle } from "lucide-react";

const iconMap: Record<string, any> = {
  "Bahasa Inggris": { icon: Book, color: "text-blue-600", bg: "bg-blue-50" },
  "Matematika": { icon: Calculator, color: "text-red-600", bg: "bg-red-50" },
  "Calistung": { icon: PenTool, color: "text-yellow-600", bg: "bg-yellow-50" },
  "PRISMA": { icon: Hash, color: "text-green-600", bg: "bg-green-50" },
  "Preschool": { icon: Baby, color: "text-purple-600", bg: "bg-purple-50" },
};

const defaultStyle = { icon: HelpCircle, color: "text-gray-600", bg: "bg-gray-50" };

export default function ProgramGrid() {
  const [programs, setPrograms] = useState<any[]>([]);

  useEffect(() => {
    axios.get("/api/programs").then(res => setPrograms(res.data));
  }, []);

  return (
    <section id="program" className="py-24 lg:py-40 bg-gray-50/50 relative overflow-hidden">
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0ea5e9 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16 lg:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-5 lg:px-6 py-2 bg-sky-100 text-sky-600 rounded-full font-black text-[9px] lg:text-[10px] uppercase tracking-[0.2em] lg:tracking-[0.3em] mb-6 lg:mb-8"
          >
            Kurikulum Terintegrasi
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl lg:text-8xl font-black text-gray-950 mb-6 lg:mb-8 tracking-[-0.04em] leading-tight lg:leading-none"
          >
            Program <span className="text-sky-600 italic">Pilihan</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg lg:text-2xl text-gray-500 font-medium leading-relaxed italic border-t-2 border-sky-100 pt-6 lg:pt-8 inline-block"
          >
            Membangun fondasi masa depan cerah melalui metode belajar yang inovatif.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 lg:gap-12">
          {programs.map((prog, idx) => {
            const style = iconMap[prog.name] || defaultStyle;
            const Icon = style.icon;

            return (
              <motion.div
                key={prog.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, ease: [0.16, 1, 0.3, 1], duration: 1 }}
                className="group bg-white p-10 lg:p-12 rounded-[3rem] lg:rounded-[4rem] shadow-ultra border border-gray-100 flex flex-col items-center text-center relative overflow-hidden hover:-translate-y-4 transition-all duration-700"
              >
                <div className={`absolute top-0 right-0 w-24 lg:w-32 h-24 lg:h-32 ${style.bg} rounded-bl-[3rem] lg:rounded-bl-[4rem] opacity-40 transition-all duration-700 group-hover:scale-125`}></div>
                
                <div className={`w-20 lg:w-28 h-20 lg:h-28 ${style.bg} ${style.color} rounded-[2rem] lg:rounded-[2.5rem] flex items-center justify-center mb-8 lg:mb-10 shadow-lg shadow-gray-100 transition-all duration-700 group-hover:rotate-[15deg] group-hover:scale-110 relative z-10`}>
                  <Icon size={44} strokeWidth={2.5} />
                </div>
                
                <h3 className="text-2xl lg:text-3xl font-black text-gray-950 mb-4 lg:mb-6 tracking-tight relative z-10">{prog.name}</h3>
                <p className="text-gray-500 font-medium leading-relaxed text-sm relative z-10 mb-6 lg:mb-8 line-clamp-3">{prog.description}</p>
                
                <a href="#daftar" className="mt-auto pt-2 relative z-10 w-full block">
                  <div className={`h-1 w-10 lg:w-12 ${style.bg.replace('bg-', 'bg-').replace('-50', '-200')} rounded-full mx-auto group-hover:w-20 lg:group-hover:w-24 transition-all duration-700`}></div>
                  <span className={`text-[10px] lg:text-[11px] font-black uppercase tracking-[0.2em] ${style.color} block mt-5 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0`}>
                    Daftar Kelas &rarr;
                  </span>
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
