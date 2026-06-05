"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Calendar, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { motion } from "framer-motion";

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/admin/blog").then(res => {
      const found = res.data.find((p: any) => p.slug === slug);
      setPost(found);
      setLoading(false);
    });
  }, [slug]);

  if (loading) return <div className="py-40 text-center animate-pulse font-black text-gray-400">MEMUAT ARTIKEL...</div>;
  if (!post) return <div className="py-40 text-center font-black text-red-500">ARTIKEL TIDAK DITEMUKAN.</div>;

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <article className="pt-40 pb-32">
        <div className="container mx-auto px-6 max-w-4xl">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sky-600 font-black uppercase tracking-widest text-xs mb-12 hover:gap-4 transition-all">
            <ArrowLeft size={16} /> Kembali ke Blog
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-6 text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-8">
              <div className="flex items-center gap-2"><Calendar size={14} className="text-sky-600" /> {new Date(post.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              <div className="flex items-center gap-2"><User size={14} className="text-sky-600" /> Admin EA</div>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-950 mb-12 leading-[1.1] tracking-tighter">
              {post.title}
            </h1>

            {post.image && (
              <div className="w-full aspect-video rounded-[3rem] overflow-hidden mb-16 shadow-ultra border-8 border-white bg-gray-50">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="prose prose-xl prose-sky max-w-none text-gray-600 font-medium leading-relaxed italic border-l-4 border-sky-100 pl-8 lg:pl-12">
              {post.content.split('\n').map((para: string, i: number) => (
                <p key={i} className="mb-8">{para}</p>
              ))}
            </div>
          </motion.div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
