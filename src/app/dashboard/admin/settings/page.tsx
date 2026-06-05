"use client";

import { useState, useEffect } from "react";
import { Save, Layout, User, CheckCircle, X, Type, FileText, Image as ImageIcon, Camera } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    logoUrl: "/logo.png",
    heroTitle: "EA - English Action | Be Brave to Act",
    heroDesc: "Bimbingan Belajar Multidisiplin Cirebon...",
    heroImageUrl: "",
    ownerName: "Ms. Owner",
    ownerMsg: "Selamat datang di EA...",
    ownerImageUrl: ""
  });

  useEffect(() => {
    axios.get("/api/admin/settings").then(res => {
      if (res.data) {
        const { heroTitle, heroDesc, heroImageUrl, ownerName, ownerMsg, ownerImageUrl, logoUrl } = res.data;
        setFormData({
          logoUrl: logoUrl || "/logo.png",
          heroTitle: heroTitle || "EA - English Action | Be Brave to Act",
          heroDesc: heroDesc || "Bimbingan Belajar Multidisiplin Cirebon...",
          heroImageUrl: heroImageUrl || "",
          ownerName: ownerName || "Ms. Owner",
          ownerMsg: ownerMsg || "Selamat datang di EA...",
          ownerImageUrl: ownerImageUrl || ""
        });
      }
      setLoading(false);
    });
  }, []);

  const handleUpload = async (file: File, field: string) => {
    const uploadData = new FormData();
    uploadData.append("file", file);
    try {
      const res = await axios.post("/api/upload", uploadData);
      setFormData(prev => ({ ...prev, [field]: res.data.url }));
    } catch (err) {
      alert("Gagal mengunggah gambar.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post("/api/admin/settings", formData);
      alert("Pengaturan landing page berhasil disimpan!");
    } catch (err) {
      alert("Gagal menyimpan pengaturan.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-20 text-center animate-pulse text-gray-400 font-black tracking-widest text-xs uppercase">MENYELARASKAN KONTEN CMS...</div>;

  return (
    <div className="max-w-5xl animate-fade pb-20">
      <div className="mb-12">
        <h1 className="text-3xl lg:text-4xl font-black text-gray-950 tracking-tighter uppercase italic">Pengaturan Landing Page</h1>
        <p className="text-gray-500 font-medium">Sesuaikan teks dan gambar publik website EA</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Branding & Logo */}
        <div className="bg-white p-10 rounded-[3rem] shadow-ultra border border-gray-100">
           <div className="flex items-center gap-4 mb-10 border-b border-gray-50 pb-6">
            <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center"><ImageIcon size={24} /></div>
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Logo & Branding</h3>
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 px-1 flex items-center gap-2">Logo Utama</label>
            <div className="flex items-center gap-8">
              <div className="w-32 h-32 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                {formData.logoUrl ? <img src={formData.logoUrl} className="w-full h-full object-contain p-4" /> : <ImageIcon size={32} className="text-gray-200" />}
              </div>
              <div className="flex flex-col gap-4">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], "logoUrl")}
                  className="text-xs file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-sky-600 file:text-white hover:file:bg-sky-700 cursor-pointer transition-all"
                />
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest px-2">Rekomendasi: PNG Transparan 512x512px</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section CMS */}
        <div className="bg-white p-10 rounded-[3rem] shadow-ultra border border-gray-100">
          <div className="flex items-center gap-4 mb-10 border-b border-gray-50 pb-6">
            <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center"><Layout size={24} /></div>
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Bagian Utama (Hero)</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1 flex items-center gap-2"><Type size={12} /> Judul Utama</label>
                <input 
                  value={formData.heroTitle}
                  onChange={(e) => setFormData({...formData, heroTitle: e.target.value})}
                  className="w-full px-8 py-5 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-sky-600 outline-none transition-all font-black text-xl text-gray-900" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1 flex items-center gap-2"><FileText size={12} /> Deskripsi Singkat</label>
                <textarea 
                  value={formData.heroDesc}
                  onChange={(e) => setFormData({...formData, heroDesc: e.target.value})}
                  className="w-full px-8 py-5 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-sky-600 outline-none transition-all font-medium text-gray-700 min-h-[120px]" 
                ></textarea>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 px-1 flex items-center gap-2">Gambar Hero (Tampilan Utama)</label>
              <div className="relative aspect-[3/4] w-full bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 overflow-hidden group">
                {formData.heroImageUrl ? (
                   <img src={formData.heroImageUrl} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300">
                    <Camera size={48} strokeWidth={1} />
                    <p className="mt-4 font-black text-[10px] uppercase tracking-widest">Belum Ada Gambar</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-sky-600/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-8">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], "heroImageUrl")}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="bg-white text-gray-950 px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl">Ganti Gambar Hero</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Owner Welcome CMS */}
        <div className="bg-white p-10 rounded-[3rem] shadow-ultra border border-gray-100">
          <div className="flex items-center gap-4 mb-10 border-b border-gray-50 pb-6">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center"><User size={24} /></div>
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Sambutan Owner</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">Nama Owner</label>
                <input 
                  value={formData.ownerName}
                  onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                  className="w-full px-8 py-5 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-sky-600 outline-none transition-all font-black text-gray-900" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">Pesan Sambutan</label>
                <textarea 
                  value={formData.ownerMsg}
                  onChange={(e) => setFormData({...formData, ownerMsg: e.target.value})}
                  className="w-full px-8 py-5 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-sky-600 outline-none transition-all font-medium text-gray-700 min-h-[250px] leading-relaxed" 
                ></textarea>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 px-1 flex items-center gap-2">Foto Owner</label>
              <div className="relative aspect-[3/4] w-full bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 overflow-hidden group">
                {formData.ownerImageUrl ? (
                   <img src={formData.ownerImageUrl} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300">
                    <Camera size={48} strokeWidth={1} />
                    <p className="mt-4 font-black text-[10px] uppercase tracking-widest">Belum Ada Foto</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-sky-600/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-8">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], "ownerImageUrl")}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="bg-white text-gray-950 px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl">Ganti Foto Owner</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={saving}
          className="w-full bg-sky-600 hover:bg-sky-700 text-white font-black py-8 rounded-[2.5rem] shadow-ultra hover:shadow-sky-100 transition-all active:scale-[0.98] flex items-center justify-center gap-4 uppercase tracking-[0.3em] text-xl"
        >
          {saving ? <div className="animate-spin rounded-full h-8 w-8 border-4 border-white/20 border-t-white"></div> : <><Save size={32} /> SIMPAN SEMUA PERUBAHAN</>}
        </button>
      </form>
    </div>
  );
}
