"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, X, Save, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";

export default function AdminGallery() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    url: ""
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get("/api/admin/gallery");
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/admin/gallery", formData);
      setModalOpen(false);
      setFormData({ title: "", url: "" });
      fetchItems();
      alert("Foto berhasil disimpan ke galeri!");
    } catch (err: any) {
      const errMsg = err.response?.data?.error || err.response?.data?.details || "Gagal menyimpan ke database";
      alert("Gagal: " + errMsg);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Hapus foto ini dari galeri?")) return;
    try {
      await axios.delete(`/api/admin/gallery?id=${id}`);
      fetchItems();
    } catch (err) {
      alert("Gagal menghapus");
    }
  };

  return (
    <div className="space-y-8 animate-fade">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-gray-950 tracking-tighter uppercase italic">Kelola Galeri EA</h1>
          <p className="text-gray-500 font-medium">Koleksi foto kegiatan bimbingan belajar English Action</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white font-black py-4 px-8 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-sky-100 transition-all active:scale-95"
        >
          <Plus size={20} strokeWidth={3} />
          UNGGAH FOTO BARU
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {loading ? (
          <div className="col-span-full text-center py-24 animate-pulse text-gray-400 font-black tracking-widest text-xs uppercase">MENYELARASKAN GALERI...</div>
        ) : items.length === 0 ? (
          <div className="col-span-full text-center py-24 text-gray-400 italic font-medium bg-white rounded-[3rem] border border-dashed border-gray-200 shadow-sm">Belum ada foto di galeri.</div>
        ) : items.map((item) => (
          <div key={item.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-ultra overflow-hidden group">
            <div className="aspect-square bg-gray-50 relative overflow-hidden">
               <img src={item.url} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
               <div className="absolute inset-0 bg-sky-600/80 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4">
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-3 bg-white text-sky-600 rounded-xl font-bold shadow-lg"><LinkIcon size={20} /></a>
                  <button 
                    onClick={() => deleteItem(item.id)}
                    className="p-3 bg-red-600 text-white rounded-xl font-bold shadow-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
               </div>
            </div>
            <div className="p-6 text-center">
               <h4 className="font-black text-gray-700 truncate text-sm uppercase tracking-tight">{item.title || "EA Documentation"}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setModalOpen(false)}></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-[3rem] shadow-ultra relative z-10 overflow-hidden border-4 border-white"
          >
            <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-2xl font-black text-gray-950 uppercase tracking-tighter italic">Unggah Foto</h3>
                <p className="text-gray-500 font-medium text-xs">Tambahkan dokumentasi kegiatan ke landing page.</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm hover:bg-red-50 hover:text-red-500 transition-all border border-gray-100"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">Keterangan Foto</label>
                <input 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-sky-600 outline-none transition-all font-bold text-gray-900" 
                  placeholder="Contoh: Keseruan Kelas Bahasa Inggris"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">Link Gambar (URL)</label>
                <div className="flex gap-2">
                  <input 
                    required
                    value={formData.url}
                    onChange={(e) => setFormData({...formData, url: e.target.value})}
                    className="flex-1 px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-sky-600 outline-none transition-all font-bold text-gray-900" 
                    placeholder="Tempel link gambar di sini (misal: https://...)"
                  />
                </div>
                <p className="mt-2 text-[9px] text-gray-400 font-bold uppercase tracking-widest px-1">
                  Tips: Gunakan link langsung ke gambar dari internet.
                </p>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-black py-6 rounded-3xl flex items-center justify-center gap-3 shadow-xl shadow-sky-100 transition-all uppercase tracking-widest text-lg active:scale-95">
                  <Save size={24} /> SIMPAN KE GALERI
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
