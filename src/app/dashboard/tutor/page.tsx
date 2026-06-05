"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, CheckCircle, XCircle, FileText, X, Save, User as UserIcon, Plus, Globe } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";

export default function TutorDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [studentModalOpen, setStudentModalOpen] = useState(false);

  // Form State Absensi
  const [attendanceData, setAttendanceData] = useState({
    status: "PRESENT",
    notes: ""
  });

  // Form State Siswa Baru
  const [studentFormData, setStudentFormData] = useState({
    name: "",
    dateOfBirth: "",
    grade: "",
    school: "",
    parentId: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/tutor/attendance");
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.patch("/api/tutor/attendance", { 
        id: selectedBooking.id, 
        attendanceStatus: attendanceData.status,
        notes: attendanceData.notes 
      });
      setModalOpen(false);
      fetchData();
    } catch (err) {
      alert("Gagal menyimpan absensi.");
    }
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/admin/students", studentFormData);
      setStudentModalOpen(false);
      alert("Data siswa berhasil ditambahkan ke sistem.");
      setStudentFormData({ name: "", dateOfBirth: "", grade: "", school: "", parentId: "" });
    } catch (err) {
      alert("Gagal menambahkan siswa.");
    }
  };

  return (
    <div className="space-y-8 animate-fade">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-gray-950 uppercase tracking-tighter italic">Panel Pengajar EA</h2>
        <button 
          onClick={() => setStudentModalOpen(true)}
          className="bg-sky-600 hover:bg-sky-700 text-white font-black py-4 px-8 rounded-2xl flex items-center gap-2 shadow-xl active:scale-95 transition-all text-xs"
        >
          <Plus size={18} /> INPUT SISWA BARU
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Jadwal Section */}
        <div className="bg-white p-8 lg:p-10 rounded-[3rem] shadow-ultra border border-gray-100">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center border border-sky-100"><Calendar size={24} /></div>
            <div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight leading-none">Jadwal Mengajar</h3>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Sesi yang direncanakan</p>
            </div>
          </div>
          
          {loading ? (
            <div className="py-20 text-center animate-pulse text-gray-400 font-black tracking-widest text-[10px] uppercase">MENYELARASKAN JADWAL...</div>
          ) : bookings.filter(b => b.status === 'SCHEDULED').length === 0 ? (
            <div className="py-20 text-center text-gray-400 italic font-medium bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200">Tidak ada jadwal aktif.</div>
          ) : (
            <div className="space-y-4">
              {bookings.filter(b => b.status === 'SCHEDULED').map((booking) => (
                <div key={booking.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-gray-50 rounded-[2.5rem] gap-4 border border-gray-100 hover:bg-sky-50/50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-sky-600 font-black border border-gray-100 shadow-sm shadow-sky-100 group-hover:rotate-6 transition-transform">
                      {booking.student.name[0]}
                    </div>
                    <div>
                      <p className="font-black text-gray-800 tracking-tight">{booking.student.name}</p>
                      <p className="text-[10px] text-sky-600 font-black uppercase tracking-widest">{booking.program.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 w-full sm:w-auto">
                    <div className="flex flex-col items-end">
                       <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{new Date(booking.date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                       <p className="text-sm font-black text-gray-700">{new Date(booking.startTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <button 
                      onClick={() => { setSelectedBooking(booking); setModalOpen(true); }}
                      className="flex-1 sm:flex-none bg-white hover:bg-sky-600 hover:text-white text-sky-600 border border-sky-200 px-8 py-3 rounded-2xl font-black text-xs transition shadow-sm active:scale-95 uppercase tracking-widest"
                    >
                      ABSENSI
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Statistik / Aktivitas Selesai */}
        <div className="bg-white p-8 lg:p-10 rounded-[3rem] shadow-ultra border border-gray-100">
           <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center border border-green-100"><CheckCircle size={24} /></div>
            <div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight leading-none">Sesi Selesai</h3>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Laporan kelas hari ini</p>
            </div>
          </div>

          <div className="space-y-4">
            {bookings.filter(b => b.status === 'COMPLETED').map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-6 bg-green-50/30 rounded-[2.5rem] border border-green-50">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${booking.attendanceStatus === 'PRESENT' ? 'bg-green-100 text-green-600' : booking.attendanceStatus === 'ONLINE' ? 'bg-sky-100 text-sky-600' : 'bg-red-100 text-red-600'}`}>
                    {booking.attendanceStatus === 'PRESENT' ? <CheckCircle size={18} /> : booking.attendanceStatus === 'ONLINE' ? <Globe size={18} /> : <XCircle size={18} />}
                  </div>
                  <div>
                    <p className="font-black text-gray-800 text-sm">{booking.student.name}</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em]">{booking.attendanceStatus}</p>
                  </div>
                </div>
                <button className="p-3 bg-white text-gray-400 rounded-xl border border-gray-100 shadow-sm"><FileText size={16} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attendance Modal */}
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
                <h3 className="text-2xl font-black text-gray-950 uppercase tracking-tighter italic">Laporan Absensi</h3>
                <p className="text-gray-500 font-medium text-xs">Konfirmasi kehadiran siswa: <span className="text-sky-600">{selectedBooking?.student.name}</span></p>
              </div>
              <button onClick={() => setModalOpen(false)} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm hover:bg-red-50 hover:text-red-500 transition-all border border-gray-100"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleAttendanceSubmit} className="p-10 space-y-8">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: "PRESENT", label: "HADIR", icon: CheckCircle, color: "green" },
                  { id: "ABSENT", label: "ALPA", icon: XCircle, color: "red" },
                  { id: "ONLINE", label: "ONLINE", icon: Globe, color: "sky" },
                ].map((opt: any) => (
                  <button 
                    key={opt.id}
                    type="button"
                    onClick={() => setAttendanceData({...attendanceData, status: opt.id})}
                    className={`p-6 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-3 ${attendanceData.status === opt.id ? `bg-${opt.color}-50 border-${opt.color}-600 text-${opt.color}-600 shadow-lg shadow-${opt.color}-100` : 'bg-gray-50 border-transparent text-gray-400'}`}
                  >
                    <opt.icon size={28} />
                    <span className="font-black uppercase tracking-widest text-[8px]">{opt.label}</span>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 px-1">Catatan Perkembangan Siswa</label>
                <textarea 
                  value={attendanceData.notes}
                  onChange={(e) => setAttendanceData({...attendanceData, notes: e.target.value})}
                  className="w-full px-6 py-4 rounded-3xl border-2 border-gray-100 bg-gray-50 focus:border-sky-600 outline-none transition-all font-medium text-gray-700 min-h-[120px]" 
                  placeholder="Ceritakan progres belajar hari ini..."
                ></textarea>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-black py-6 rounded-3xl flex items-center justify-center gap-3 shadow-xl shadow-sky-100 transition-all uppercase tracking-widest text-lg active:scale-95">
                  <Save size={24} /> SIMPAN LAPORAN
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Student Modal */}
      {studentModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setStudentModalOpen(false)}></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-[3rem] shadow-ultra relative z-10 overflow-hidden border-4 border-white"
          >
            <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-2xl font-black text-gray-950 uppercase tracking-tighter italic">Input Siswa Baru</h3>
                <p className="text-gray-500 font-medium text-xs">Laporkan jika ada siswa baru yang mendaftar.</p>
              </div>
              <button onClick={() => setStudentModalOpen(false)} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm hover:bg-red-50 hover:text-red-500 transition-all border border-gray-100"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleStudentSubmit} className="p-10 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">Nama Siswa</label>
                <input required value={studentFormData.name} onChange={(e) => setStudentFormData({...studentFormData, name: e.target.value})} className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-sky-600 outline-none transition-all font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">Tanggal Lahir</label>
                  <input type="date" required value={studentFormData.dateOfBirth} onChange={(e) => setStudentFormData({...studentFormData, dateOfBirth: e.target.value})} className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-sky-600 outline-none transition-all font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">Kelas</label>
                  <input value={studentFormData.grade} onChange={(e) => setStudentFormData({...studentFormData, grade: e.target.value})} className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-sky-600 outline-none transition-all font-bold" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">ID Orang Tua</label>
                <input required value={studentFormData.parentId} onChange={(e) => setStudentFormData({...studentFormData, parentId: e.target.value})} className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-sky-600 outline-none transition-all font-bold" placeholder="Parent ID..." />
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-black py-6 rounded-3xl flex items-center justify-center gap-3 shadow-xl shadow-sky-100 transition-all uppercase tracking-widest text-lg">
                  <Save size={24} /> SIMPAN DATA SISWA
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
