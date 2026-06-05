"use client";

import { useState, useEffect } from "react";
import { Plus, Search, FileText, Download, CheckCircle, Clock, XCircle, X, Save, CreditCard, Printer, User as UserIcon } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AdminBilling() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    studentId: "",
    amount: 0,
    dueDate: "",
    description: "",
    items: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [invRes, stuRes] = await Promise.all([
        axios.get("/api/admin/billing"),
        axios.get("/api/admin/students")
      ]);
      setInvoices(invRes.data);
      setStudents(stuRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Find parentId from selected student
      const selectedStudent = students.find(s => s.id === formData.studentId);
      if (!selectedStudent) return alert("Pilih siswa terlebih dahulu.");

      await axios.post("/api/admin/billing", {
        ...formData,
        parentId: selectedStudent.parentId,
        studentName: selectedStudent.name // Store student name in description or items if needed, but for now we just use parentId for the record
      });
      setModalOpen(false);
      setFormData({ studentId: "", amount: 0, dueDate: "", description: "", items: [] });
      fetchData();
    } catch (err) {
      alert("Gagal membuat invoice.");
    }
  };

  return (
    <div className="space-y-8 animate-fade">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-gray-950 tracking-tighter uppercase italic">Tagihan & Invoice</h1>
          <p className="text-gray-500 font-medium">Monitoring pembayaran SPP dan biaya pendaftaran</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white font-black py-4 px-8 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-sky-100 transition-all active:scale-95 text-xs"
        >
          <Plus size={20} strokeWidth={3} /> BUAT INVOICE BARU
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Total Piutang", value: "Rp 12.500.000", icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
          { label: "Diterima Bulan Ini", value: "Rp 45.800.000", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
          { label: "Invoice Menunggu", value: "12", icon: FileText, color: "text-sky-600", bg: "bg-sky-50" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[3rem] shadow-ultra border border-gray-100 flex items-center gap-6">
            <div className={`${stat.bg} ${stat.color} p-5 rounded-2xl`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-gray-400 font-black uppercase tracking-widest text-[10px] mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-gray-950 tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-ultra overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col md:row justify-between items-center gap-6 bg-gray-50/30">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input className="w-full pl-12 pr-6 py-3.5 rounded-xl border border-gray-200 bg-white outline-none focus:border-sky-600 font-bold text-sm shadow-sm" placeholder="Cari nomor invoice atau siswa..." />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Nomor Invoice</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Siswa</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Jumlah</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="px-8 py-20 text-center animate-pulse text-gray-400 font-black tracking-widest text-xs uppercase">MENYELARASKAN DATA INVOICE...</td></tr>
              ) : invoices.length === 0 ? (
                <tr><td colSpan={5} className="px-8 py-20 text-center text-gray-400 italic font-medium">Belum ada invoice dibuat.</td></tr>
              ) : invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <p className="font-black text-gray-800 uppercase tracking-tighter">#INV-{inv.id.slice(-6).toUpperCase()}</p>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Tempo: {new Date(inv.dueDate).toLocaleDateString()}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-black text-gray-700">{students.find(s => s.parentId === inv.parentId)?.name || "N/A"}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-black text-sky-600">Rp {inv.amount.toLocaleString()}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${inv.status === "PAID" ? "bg-green-100 text-green-600 border border-green-200" : inv.status === "UNPAID" ? "bg-orange-100 text-orange-600" : "bg-red-100 text-red-600"}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right space-x-2">
                    <Link href={`/dashboard/admin/billing/print/${inv.id}`} target="_blank" className="p-3 bg-white text-gray-400 rounded-xl hover:bg-sky-600 hover:text-white transition-all shadow-sm border border-gray-100 inline-block">
                      <Printer size={18} />
                    </Link>
                    <button className="p-3 bg-white text-gray-400 rounded-xl hover:bg-sky-600 hover:text-white transition-all shadow-sm border border-gray-100"><Download size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal */}
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
                <h3 className="text-2xl font-black text-gray-950 uppercase tracking-tighter italic">Buat Invoice</h3>
                <p className="text-gray-500 font-medium text-xs">Kirim tagihan pembayaran baru berdasarkan nama murid.</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">Pilih Murid</label>
                <div className="relative">
                   <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                   <select 
                    required 
                    value={formData.studentId} 
                    onChange={(e) => setFormData({...formData, studentId: e.target.value})} 
                    className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-sky-600 outline-none transition-all font-bold appearance-none cursor-pointer"
                   >
                     <option value="">Pilih Siswa...</option>
                     {students.map(s => <option key={s.id} value={s.id}>{s.name} (Ortu: {s.parent?.name})</option>)}
                   </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">Jumlah (Rp)</label>
                  <input type="number" required value={formData.amount} onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})} className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-sky-600 outline-none transition-all font-bold text-gray-900" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">Jatuh Tempo</label>
                  <input type="date" required value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-sky-600 outline-none transition-all font-bold" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">Keterangan / Deskripsi</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-sky-600 outline-none transition-all font-medium text-gray-700" placeholder="Contoh: SPP Bulan Juni 2026..."></textarea>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-black py-6 rounded-3xl flex items-center justify-center gap-3 shadow-xl shadow-sky-100 transition-all uppercase tracking-widest text-lg">
                  <CreditCard size={24} /> TERBITKAN TAGIHAN
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
