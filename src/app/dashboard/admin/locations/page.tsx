"use client";

import { useState, useEffect } from "react";
import { Plus, Search, MapPin, Trash2, X, Save, Globe } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";

export default function AdminLocations() {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    mapsUrl: ""
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await axios.get("/api/admin/locations");
      setLocations(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/admin/locations", formData);
      setModalOpen(false);
      setFormData({ name: "", address: "", mapsUrl: "" });
      fetchLocations();
    } catch (err) {
      alert("Gagal menambahkan cabang");
    }
  };

  const deleteLocation = async (id: string) => {
    if (!confirm("Hapus cabang ini?")) return;
    try {
      await axios.delete(`/api/admin/locations?id=${id}`);
      fetchLocations();
    } catch (err) {
      alert("Gagal menghapus");
    }
  };

  return (
    <div className="space-y-8 animate-fade">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-gray-950 tracking-tighter uppercase">Manajemen Cabang</h1>
          <p className="text-gray-500 font-medium">Kelola lokasi bimbingan belajar English Action</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white font-black py-4 px-8 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-sky-100 transition-all active:scale-95"
        >
          <Plus size={20} strokeWidth={3} />
          TAMBAH CABANG BARU
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full text-center py-24 animate-pulse text-gray-400 font-black tracking-widest text-xs uppercase">MENYELARASKAN DATA CABANG...</div>
        ) : locations.length === 0 ? (
          <div className="col-span-full text-center py-24 text-gray-400 italic font-medium bg-white rounded-[3rem] border border-dashed border-gray-200 shadow-sm">Belum ada cabang terdaftar.</div>
        ) : locations.map((loc) => (
          <div key={loc.id} className="bg-white p-10 rounded-[3rem] shadow-ultra border border-gray-100 group relative overflow-hidden transition-all hover:-translate-y-2">
            <div className="absolute top-0 right-0 w-24 h-24 bg-sky-50 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-700 opacity-50"></div>
            
            <div className="w-16 h-16 bg-sky-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-sky-100 group-hover:rotate-12 transition-transform">
              <MapPin size={32} strokeWidth={2.5} />
            </div>
            
            <h3 className="text-2xl font-black text-gray-950 mb-4 tracking-tight">{loc.name}</h3>
            <p className="text-gray-500 font-medium text-sm leading-relaxed mb-8">{loc.address}</p>
            
            <div className="flex items-center justify-between mt-auto">
              <a 
                href={loc.mapsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sky-600 font-black uppercase tracking-widest text-[10px] hover:underline"
              >
                LIHAT DI MAPS <Globe size={14} />
              </a>
              <button 
                onClick={() => deleteLocation(loc.id)}
                className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Branch Modal */}
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
                <h3 className="text-2xl font-black text-gray-950 uppercase tracking-tighter italic">Cabang Baru</h3>
                <p className="text-gray-500 font-medium text-xs">Daftarkan lokasi cabang bimbingan belajar EA.</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm hover:bg-red-50 hover:text-red-500 transition-all border border-gray-100"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">Nama Cabang</label>
                <input 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-sky-600 outline-none transition-all font-bold text-gray-900" 
                  placeholder="Contoh: EA Cabang Kr. Mekar"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">Alamat Lengkap</label>
                <textarea 
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-sky-600 outline-none transition-all font-medium text-gray-700 min-h-[100px]" 
                  placeholder="Jl. Merdeka No. 123..."
                ></textarea>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">Google Maps URL</label>
                <input 
                  required
                  value={formData.mapsUrl}
                  onChange={(e) => setFormData({...formData, mapsUrl: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-sky-600 outline-none transition-all font-bold text-gray-900" 
                  placeholder="https://maps.google.com/..."
                />
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-black py-6 rounded-3xl flex items-center justify-center gap-3 shadow-xl shadow-sky-100 transition-all uppercase tracking-widest text-lg active:scale-95">
                  <Save size={24} /> SIMPAN CABANG
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
