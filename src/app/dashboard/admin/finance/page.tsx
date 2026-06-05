"use client";

import { useState, useEffect } from "react";
import { Plus, Search, TrendingUp, TrendingDown, DollarSign, X, Save, Trash2, Calendar } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";

export default function AdminFinance() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    type: "INCOME",
    category: "SPP",
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    description: ""
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("/api/admin/finance");
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/admin/finance", formData);
      setModalOpen(false);
      setFormData({ type: "INCOME", category: "SPP", amount: 0, date: new Date().toISOString().split('T')[0], description: "" });
      fetchTransactions();
    } catch (err) {
      alert("Gagal mencatat transaksi.");
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!confirm("Hapus catatan transaksi ini?")) return;
    try {
      await axios.delete(`/api/admin/finance?id=${id}`);
      fetchTransactions();
    } catch (err) {
      alert("Gagal menghapus");
    }
  };

  const totalIncome = transactions.filter(t => t.type === "INCOME").reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "EXPENSE").reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="space-y-8 animate-fade">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-gray-950 tracking-tighter uppercase italic">Laporan Keuangan</h1>
          <p className="text-gray-500 font-medium">Monitoring arus kas (Pemasukan & Pengeluaran) EA</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white font-black py-4 px-8 rounded-2xl flex items-center justify-center gap-2 shadow-xl transition-all active:scale-95"
        >
          <Plus size={20} strokeWidth={3} /> CATAT TRANSAKSI
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[3rem] shadow-ultra border border-gray-100 flex items-center gap-6">
          <div className="bg-green-50 text-green-600 p-5 rounded-2xl"><TrendingUp size={28} /></div>
          <div>
            <p className="text-gray-400 font-black uppercase tracking-widest text-[10px] mb-1">Total Pemasukan</p>
            <p className="text-2xl font-black text-gray-950 tracking-tight">Rp {totalIncome.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[3rem] shadow-ultra border border-gray-100 flex items-center gap-6">
          <div className="bg-red-50 text-red-600 p-5 rounded-2xl"><TrendingDown size={28} /></div>
          <div>
            <p className="text-gray-400 font-black uppercase tracking-widest text-[10px] mb-1">Total Pengeluaran</p>
            <p className="text-2xl font-black text-gray-950 tracking-tight">Rp {totalExpense.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-sky-600 p-8 rounded-[3rem] shadow-ultra text-white flex items-center gap-6">
          <div className="bg-white/20 p-5 rounded-2xl"><DollarSign size={28} /></div>
          <div>
            <p className="text-white/70 font-black uppercase tracking-widest text-[10px] mb-1">Saldo Bersih</p>
            <p className="text-2xl font-black tracking-tight">Rp {balance.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-ultra overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col md:row justify-between items-center gap-6 bg-gray-50/30">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input className="w-full pl-12 pr-6 py-3.5 rounded-xl border border-gray-200 bg-white outline-none focus:border-sky-600 font-bold text-sm shadow-sm" placeholder="Cari transaksi..." />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Tanggal</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Kategori</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Deskripsi</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Jumlah</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="px-8 py-20 text-center animate-pulse text-gray-400 font-black tracking-widest text-xs uppercase">MENYELARASKAN DATA KEUANGAN...</td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan={5} className="px-8 py-20 text-center text-gray-400 italic font-medium">Belum ada catatan transaksi.</td></tr>
              ) : transactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <p className="font-bold text-gray-700">{new Date(t.date).toLocaleDateString()}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-black uppercase">{t.category}</span>
                  </td>
                  <td className="px-8 py-6 text-gray-500 font-medium text-sm">{t.description || "-"}</td>
                  <td className="px-8 py-6">
                    <p className={`font-black ${t.type === "INCOME" ? "text-green-600" : "text-red-600"}`}>
                      {t.type === "INCOME" ? "+" : "-"} Rp {t.amount.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button onClick={() => deleteTransaction(t.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-sm"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Entry Modal */}
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
                <h3 className="text-2xl font-black text-gray-950 uppercase tracking-tighter italic">Catat Transaksi</h3>
                <p className="text-gray-500 font-medium text-xs">Masukkan data pemasukan atau pengeluaran baru.</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm hover:bg-red-50 hover:text-red-500 transition-all border border-gray-100"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, type: "INCOME"})}
                  className={`flex-1 p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-2 ${formData.type === "INCOME" ? "bg-green-50 border-green-600 text-green-600 shadow-lg shadow-green-100" : "bg-gray-50 border-transparent text-gray-400"}`}
                >
                  <TrendingUp size={24} />
                  <span className="font-black uppercase tracking-widest text-[10px]">PEMASUKAN</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, type: "EXPENSE"})}
                  className={`flex-1 p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-2 ${formData.type === "EXPENSE" ? "bg-red-50 border-red-600 text-red-600 shadow-lg shadow-red-100" : "bg-gray-50 border-transparent text-gray-400"}`}
                >
                  <TrendingDown size={24} />
                  <span className="font-black uppercase tracking-widest text-[10px]">PENGELUARAN</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">Kategori</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-sky-600 outline-none transition-all font-bold appearance-none cursor-pointer"
                  >
                    <option>SPP</option>
                    <option>Pendaftaran</option>
                    <option>Gaji Tutor</option>
                    <option>Sewa Gedung</option>
                    <option>Listrik & Air</option>
                    <option>Marketing</option>
                    <option>Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">Tanggal</label>
                  <input type="date" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-sky-600 outline-none transition-all font-bold" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">Jumlah (Rp)</label>
                <input type="number" required value={formData.amount} onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})} className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-sky-600 outline-none transition-all font-bold text-gray-900" />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">Deskripsi</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-sky-600 outline-none transition-all font-medium text-gray-700" placeholder="Keterangan tambahan..."></textarea>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-black py-6 rounded-3xl flex items-center justify-center gap-3 shadow-xl shadow-sky-100 transition-all uppercase tracking-widest text-lg active:scale-95">
                  <Save size={24} /> SIMPAN TRANSAKSI
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
