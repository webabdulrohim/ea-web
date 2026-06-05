"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link as LinkIcon, Trash2 } from "lucide-react";

export default function Gallery() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    axios.get("/api/admin/gallery").then(res => {
      setItems(res.data);
    });
  }, []);

  return (
    <section id="galeri" className="py-24 lg:py-40 bg-white transition-colors relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between mb-16 lg:mb-24 gap-8 text-center lg:text-left">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 text-sky-600 font-black uppercase tracking-[0.3em] lg:tracking-[0.4em] text-[9px] lg:text-[10px] mb-6"
            >
              <div className="w-8 lg:w-10 h-0.5 bg-sky-200"></div>
              Visual Experience
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl lg:text-8xl font-black text-gray-950 tracking-[-0.04em] leading-tight lg:leading-none"
            >
              Galeri <span className="text-sky-600 italic">EA</span>
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-lg lg:text-xl text-gray-400 font-medium italic lg:text-right max-w-sm"
          >
            Melihat lebih dekat keceriaan dan semangat belajar para siswa di English Action.
          </motion.p>
        </div>

        {/* Artistic Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {items.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, ease: [0.16, 1, 0.3, 1], duration: 1 }}
              className="aspect-[4/5] bg-gray-50 rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden shadow-premium group border-[6px] lg:border-8 border-white hover:shadow-ultra transition-all duration-700 relative"
            >
              <img 
                src={item.url} 
                alt={item.title || "Gallery Item"} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-2"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 lg:p-8">
                <p className="text-white font-black text-lg tracking-tight translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{item.title || "EA Activity"}</p>
                <p className="text-sky-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">Documentation</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
