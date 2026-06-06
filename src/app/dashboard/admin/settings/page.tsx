"use client";

import { useState, useEffect } from "react";
import { Save, Layout, User, Type, FileText, Image as ImageIcon, Camera } from "lucide-react";
import axios from "axios";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post("/api/admin/settings", formData);
      alert("Pengaturan landing page berhasil disimpan!");
    } catch (err: any) {
      const errMsg = err.response?.data?.error || err.response?.data?.details || "Gagal menyimpan pengaturan.";
      alert("Simpan Gagal: " + errMsg);
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
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 px-1 flex items-center gap-2">Logo Utama (Link URL)</label>
            <div className="flex items-center gap-8">
              <div className="w-48 h-48 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                {formData.logoUrl ? <img src={formData.logoUrl} className="w-full h-full object-contain p-4" /> : <ImageIcon size={48} className="text-gray-200" />}
              </div>
              <div className="flex-1">
                <input 
                  type="text"
                  placeholder="Tempel link logo (URL) di sini"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
                  className="w-full px-6 py-4 border-2 border-gray-100 rounded-2xl text-sm font-bold outline-none focus:border-sky-600"
                />
                <p className="mt-4 text-[9px] text-gray-400 font-bold uppercase tracking-widest px-2">Masukkan link gambar langsung (misal: https://imgur.com/logo.png)</p>
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
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 px-1 flex items-center gap-2">Gambar Hero (Link URL)</label>
              <input 
                type="text"
                placeholder="Tempel link gambar hero (URL) di sini"
                value={formData.heroImageUrl}
                onChange={(e) => setFormData({...formData, heroImageUrl: e.target.value})}
                className="w-full mb-4 px-6 py-3 border-2 border-gray-100 rounded-2xl text-xs font-bold focus:border-sky-600 outline-none"
              />
              <div className="relative aspect-[3/4] w-full bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 overflow-hidden">
                {formData.heroImageUrl ? (
                   <img src={formData.heroImageUrl} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300">
                    <Camera size={48} strokeWidth={1} />
                    <p className="mt-4 font-black text-[10px] uppercase tracking-widest text-center px-4">Belum Ada Gambar / Link Tidak Valid</p>
                  </div>
                )}
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
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 px-1 flex items-center gap-2">Foto Owner (Link URL)</label>
              <input 
                type="text"
                placeholder="Tempel link foto owner (URL) di sini"
                value={formData.ownerImageUrl}
                onChange={(e) => setFormData({...formData, ownerImageUrl: e.target.value})}
                className="w-full mb-4 px-6 py-3 border-2 border-gray-100 rounded-2xl text-xs font-bold focus:border-sky-600 outline-none"
              />
              <div className="relative aspect-[3/4] w-full bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 overflow-hidden">
                {formData.ownerImageUrl ? (
                   <img src={formData.ownerImageUrl} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300">
                    <Camera size={48} strokeWidth={1} />
                    <p className="mt-4 font-black text-[10px] uppercase tracking-widest text-center px-4">Belum Ada Foto / Link Tidak Valid</p>
                  </div>
                )}
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
