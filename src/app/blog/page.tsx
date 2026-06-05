"use client";

import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";

import { useEffect, useState } from "react";
import axios from "axios";

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/admin/blog")
      .then(res => setPosts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-white transition-colors">
      <Navbar />
      
      <section className="pt-32 pb-16 lg:pt-48 lg:pb-24 bg-sky-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-600 via-sky-400 to-sky-600 opacity-20"></div>
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-5 py-2 bg-white text-sky-600 rounded-full font-black text-[9px] uppercase tracking-[0.3em] mb-6 shadow-sm border border-sky-100"
          >
            Update & Wawasan
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl lg:text-8xl font-black text-gray-950 mb-6 tracking-tighter"
          >
            Blog & <span className="text-sky-600 italic">Berita</span>
          </motion.h1>
          <p className="text-lg lg:text-2xl text-gray-500 font-medium max-w-2xl mx-auto italic">
            Tips belajar, informasi program, dan kabar terbaru dari English Action.
          </p>
        </div>
      </section>

      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {loading ? (
              <div className="col-span-full text-center py-24 animate-pulse text-gray-400 font-black tracking-widest text-xs uppercase">MENYELARASKAN DATA BLOG...</div>
            ) : posts.length === 0 ? (
              <div className="col-span-full text-center py-24 text-gray-400 font-medium italic bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">Belum ada postingan blog saat ini.</div>
            ) : posts.map((post, idx) => (
              <motion.article 
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, ease: [0.16, 1, 0.3, 1], duration: 1 }}
                className="group cursor-pointer"
              >
                <div className={`w-full aspect-[16/9] ${post.image || 'bg-sky-50'} rounded-[2.5rem] lg:rounded-[3.5rem] mb-8 overflow-hidden shadow-premium group-hover:shadow-ultra transition-all duration-700 relative border-4 lg:border-8 border-white`}>
                  {post.image && post.image.startsWith('http') ? (
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sky-200 font-black text-6xl italic opacity-50 group-hover:scale-110 transition-transform duration-1000">EA</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                <div className="flex items-center gap-6 text-gray-400 font-bold uppercase tracking-[0.2em] text-[9px] mb-6">
                  <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg"><Calendar size={12} className="text-sky-600" /> {new Date(post.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}</div>
                  <div className="flex items-center gap-2"><User size={12} className="text-sky-600" /> Admin EA</div>
                </div>
                
                <h2 className="text-3xl lg:text-5xl font-black text-gray-950 mb-6 group-hover:text-sky-600 transition-colors tracking-tight leading-tight">
                  {post.title}
                </h2>
                <p className="text-lg text-gray-500 leading-relaxed mb-10 line-clamp-2 italic font-medium">
                  {post.content}
                </p>
                <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-4 text-sky-600 font-black uppercase tracking-[0.2em] text-[10px] group-hover:gap-6 transition-all">
                  Baca Selengkapnya <ArrowRight size={18} />
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
