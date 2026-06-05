"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Users, Calendar, Award, X, Save, Mail, Phone, Lock } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";

export default function AdminTutors() {
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "password123", // Default password
    phoneNumber: ""
  });

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    try {
      const res = await axios.get("/api/admin/tutors");
      setTutors(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/admin/tutors", formData);
      setModalOpen(false);
      setFormData({ name: "", email: "", password: "password123", phoneNumber: "" });
      fetchTutors();
    } catch (err) {
      alert("Gagal menambahkan tutor baru.");
    }
  };

  return (
    <div className="space-y-8 animate-fade">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-gray-950 tracking-tighter uppercase italic">Manajemen Tutor</h1>
          <p className="text-gray-500 font-medium">Rekrutmen dan pengelolaan jadwal tenaga pengajar EA</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white font-black py-4 px-8 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-sky-100 transition-all active:scale-95"
        >
          <Plus size={20} strokeWidth={3} /> REKRUT TUTOR BARU
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full text-center py-24 animate-pulse text-gray-400 font-black tracking-widest text-xs uppercase">MENYELARASKAN DATA TUTOR...</div>
        ) : tutors.length === 0 ? (
          <div className="col-span-full text-center py-24 text-gray-400 italic font-medium bg-white rounded-[3rem] border border-dashed border-gray-200 shadow-sm">Belum ada tutor terdaftar.</div>
        ) : tutors.map((tutor) => (
          <div key={tutor.id} className="bg-white p-10 rounded-[3rem] shadow-ultra border border-gray-100 group relative overflow-hidden transition-all hover:-translate-y-2">
            <div className="flex items-start justify-between mb-8">
              <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600 shadow-sm border border-sky-100">
                <Users size={32} />
              </div>
              <div className="flex gap-2">
                <button className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-sky-600 hover:text-white transition-all shadow-sm"><Calendar size={18} /></button>
                <button className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-sky-600 hover:text-white transition-all shadow-sm"><Award size={18} /></button>
              </div>
            </div>
            
            <h3 className="text-2xl font-black text-gray-950 mb-2 tracking-tight">{tutor.name}</h3>
            <p className="text-sky-600 font-bold text-xs uppercase tracking-widest mb-6 italic">{tutor.email}</p>
            
            <div className="space-y-4">
               <div className="flex items-center gap-3 text-gray-500">
                  <Phone size={14} className="text-sky-400" />
                  <span className="text-sm font-medium">{tutor.phoneNumber || "No Phone"}</span>
               </div>
               <div className="pt-4 border-t border-gray-50">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Keahlian Program</p>
                  <div className="flex flex-wrap gap-2">
                    {tutor.tutorSkills.length === 0 ? (
                      <span className="text-[10px] text-gray-300 italic">Belum diatur</span>
                    ) : tutor.tutorSkills.map((s: any) => (
                      <span key={s.id} className="px-3 py-1 bg-sky-50 text-sky-600 rounded-lg text-[10px] font-black uppercase">{s.program.name}</span>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recruitment Modal */}
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
                <h3 className="text-2xl font-black text-gray-950 uppercase tracking-tighter italic">Rekrut Tutor</h3>
                <p className="text-gray-500 font-medium text-xs">Tambahkan tenaga pengajar baru ke dalam tim EA.</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm hover:bg-red-50 hover:text-red-500 transition-all border border-gray-100"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">Nama Lengkap</label>
                <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-sky-600 outline-none transition-all font-bold" placeholder="Nama Tutor..." />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">Email (Username)</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-sky-600 outline-none transition-all font-bold" placeholder="tutor@ea.com" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">Password Awal</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-sky-600 outline-none transition-all font-bold" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">Nomor HP / WhatsApp</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-sky-600 outline-none transition-all font-bold" placeholder="08xxxx" />
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-black py-6 rounded-3xl flex items-center justify-center gap-3 shadow-xl shadow-sky-100 transition-all uppercase tracking-widest text-lg">
                  <Save size={24} /> SIMPAN DATA TUTOR
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
