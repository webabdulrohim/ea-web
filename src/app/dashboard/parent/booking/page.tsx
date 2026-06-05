"use client";

import { useState, useEffect } from "react";
import { Search, Calendar, Clock, BookOpen, User as UserIcon, Plus, X, Save, CheckCircle } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";

export default function ParentBooking() {
  const [tutors, setTutors] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState<any>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    studentId: "",
    programId: "",
    date: "",
    startTime: "",
    endTime: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tutorsRes, studentsRes] = await Promise.all([
        axios.get("/api/parent/tutors"),
        axios.get("/api/parent/students")
      ]);
      setTutors(tutorsRes.data);
      setStudents(studentsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const start = new Date(`${formData.date}T${formData.startTime}`);
      const end = new Date(`${formData.date}T${formData.endTime}`);
      
      await axios.post("/api/parent/bookings", {
        tutorId: selectedTutor.id,
        ...formData,
        startTime: start,
        endTime: end
      });
      
      setModalOpen(false);
      alert("Booking berhasil diajukan!");
    } catch (err) {
      alert("Gagal melakukan booking. Silakan coba lagi.");
    }
  };

  return (
    <div className="space-y-10 animate-fade">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-gray-950 tracking-tighter uppercase italic">Cari Jadwal & Booking</h1>
          <p className="text-gray-500 font-medium">Temukan tutor terbaik dan tentukan waktu belajar anak Anda.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input className="w-full pl-12 pr-6 py-3.5 rounded-2xl border border-gray-100 bg-white outline-none focus:border-sky-600 font-bold text-sm shadow-sm" placeholder="Cari keahlian atau nama tutor..." />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full text-center py-20 animate-pulse text-gray-400 font-black tracking-widest text-xs uppercase">MENCARI TUTOR TERSEDIA...</div>
        ) : tutors.map((tutor) => (
          <div key={tutor.id} className="bg-white p-8 rounded-[3rem] shadow-ultra border border-gray-100 group relative overflow-hidden transition-all hover:-translate-y-2">
            <div className="flex items-start justify-between mb-8">
              <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600 border border-sky-100 shadow-sm">
                <UserIcon size={32} />
              </div>
              <div className="bg-green-50 text-green-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">Available</div>
            </div>
            
            <h3 className="text-2xl font-black text-gray-950 mb-2 tracking-tight">{tutor.name}</h3>
            <div className="flex flex-wrap gap-2 mb-8">
              {tutor.tutorSkills.map((s: any) => (
                <span key={s.id} className="px-3 py-1 bg-gray-50 text-gray-500 rounded-lg text-[9px] font-black uppercase border border-gray-100">{s.program.name}</span>
              ))}
            </div>

            <button 
              onClick={() => { setSelectedTutor(tutor); setModalOpen(true); }}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-sky-100 transition-all active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
            >
              <Calendar size={18} /> BOOKING SEKARANG
            </button>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setModalOpen(false)}></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-xl rounded-[3.5rem] shadow-ultra relative z-10 overflow-hidden border-4 border-white"
          >
            <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-2xl font-black text-gray-950 uppercase tracking-tighter italic">Formulir Booking</h3>
                <p className="text-gray-500 font-medium text-xs">Pesan sesi belajar dengan <span className="text-sky-600">{selectedTutor?.name}</span></p>
              </div>
              <button onClick={() => setModalOpen(false)} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleBooking} className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">Pilih Anak</label>
                  <select 
                    required
                    value={formData.studentId}
                    onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-sky-600 outline-none transition-all font-bold appearance-none cursor-pointer"
                  >
                    <option value="">Pilih Siswa</option>
                    {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">Pilih Program</label>
                  <select 
                    required
                    value={formData.programId}
                    onChange={(e) => setFormData({...formData, programId: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-sky-600 outline-none transition-all font-bold appearance-none cursor-pointer"
                  >
                    <option value="">Pilih Program</option>
                    {selectedTutor?.tutorSkills.map((s: any) => <option key={s.program.id} value={s.program.id}>{s.program.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">Tanggal Belajar</label>
                <input type="date" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-sky-600 outline-none transition-all font-bold" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">Waktu Mulai</label>
                  <input type="time" required value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-sky-600 outline-none transition-all font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">Waktu Selesai</label>
                  <input type="time" required value={formData.endTime} onChange={(e) => setFormData({...formData, endTime: e.target.value})} className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-sky-600 outline-none transition-all font-bold" />
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-black py-6 rounded-3xl flex items-center justify-center gap-3 shadow-xl shadow-sky-100 transition-all uppercase tracking-widest text-lg">
                  <Save size={24} /> KIRIM PERMINTAAN
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
