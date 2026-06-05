"use client";

import { useState, useEffect } from "react";
import { CreditCard, Clock, CheckCircle, XCircle, FileText, Download, Upload, X, Save, Image as ImageIcon } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";

export default function ParentBilling() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  
  // Form State Konfirmasi
  const [formData, setFormData] = useState({
    proofImage: ""
  });

  useEffect(() => {
    axios.get("/api/parent/billing").then(res => {
      setInvoices(res.data);
      setLoading(false);
    });
  }, []);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.patch("/api/admin/billing", { // Re-use or separate confirm API
        id: selectedInvoice.id,
        status: "PENDING", // Status konfirmasi menunggu verifikasi admin
        proofImage: formData.proofImage
      });
      setModalOpen(false);
      alert("Konfirmasi pembayaran berhasil dikirim!");
    } catch (err) {
      alert("Gagal mengirim konfirmasi.");
    }
  };

  return (
    <div className="space-y-10 animate-fade">
      <div>
        <h1 className="text-3xl lg:text-4xl font-black text-gray-950 tracking-tighter uppercase italic">Tagihan & Pembayaran</h1>
        <p className="text-gray-500 font-medium">Kelola pembayaran biaya pendidikan dan pendaftaran anak Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[3rem] border border-gray-100 shadow-ultra overflow-hidden">
          <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
             <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs">Riwayat Invoice</h3>
             <CreditCard size={20} className="text-sky-600" />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Nomor Invoice</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Jumlah</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr><td colSpan={4} className="px-8 py-20 text-center animate-pulse text-gray-400 font-black tracking-widest text-xs">MENYELARASKAN DATA...</td></tr>
                ) : invoices.length === 0 ? (
                  <tr><td colSpan={4} className="px-8 py-20 text-center text-gray-400 italic">Tidak ada tagihan aktif.</td></tr>
                ) : invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <p className="font-black text-gray-800 uppercase tracking-tighter">#INV-{inv.id.slice(-6).toUpperCase()}</p>
                      <p className="text-gray-400 text-[10px] font-bold mt-1">Tempo: {new Date(inv.dueDate).toLocaleDateString()}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-black text-sky-600">Rp {inv.amount.toLocaleString()}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${inv.status === "PAID" ? "bg-green-100 text-green-600" : inv.status === "UNPAID" ? "bg-orange-100 text-orange-600" : "bg-red-100 text-red-600"}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        {inv.status === "UNPAID" && (
                          <button 
                            onClick={() => { setSelectedInvoice(inv); setModalOpen(true); }}
                            className="bg-sky-600 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-sky-100 active:scale-95 transition-transform"
                          >
                            Konfirmasi
                          </button>
                        )}
                        <button className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:bg-sky-600 hover:text-white transition-all shadow-sm"><Download size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Informasi Pembayaran Card */}
        <div className="space-y-8">
           <div className="bg-sky-600 p-10 rounded-[3rem] text-white shadow-ultra relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-[4rem] -z-0"></div>
              <h3 className="text-xl font-black uppercase tracking-tighter italic mb-8">Informasi Rekening</h3>
              <div className="space-y-6 relative z-10">
                 <div>
                    <p className="text-sky-200 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Bank Central Asia (BCA)</p>
                    <p className="text-2xl font-black tracking-tight">8830 1234 567</p>
                    <p className="text-sm font-bold text-sky-100">A/N English Action Cirebon</p>
                 </div>
                 <div className="pt-6 border-t border-white/20">
                    <p className="text-sky-200 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Bank Mandiri</p>
                    <p className="text-2xl font-black tracking-tight">134 00 12345 678</p>
                    <p className="text-sm font-bold text-sky-100">A/N English Action Cirebon</p>
                 </div>
              </div>
           </div>

           <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-ultra flex items-center gap-6">
              <div className="bg-green-50 text-green-600 p-5 rounded-2xl"><CheckCircle size={28} /></div>
              <div>
                 <p className="text-gray-400 font-black uppercase tracking-widest text-[9px] mb-1">Total Terbayar</p>
                 <p className="text-xl font-black text-gray-950 tracking-tight">Rp {invoices.filter(i => i.status === 'PAID').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}</p>
              </div>
           </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setModalOpen(false)}></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-[3.5rem] shadow-ultra relative z-10 overflow-hidden border-4 border-white"
          >
            <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-2xl font-black text-gray-950 uppercase tracking-tighter italic">Konfirmasi Bayar</h3>
                <p className="text-gray-500 font-medium text-xs">Kirim bukti transfer untuk tagihan <span className="text-sky-600">#INV-{selectedInvoice?.id.slice(-6).toUpperCase()}</span></p>
              </div>
              <button onClick={() => setModalOpen(false)} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleConfirm} className="p-10 space-y-8">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 px-1 flex items-center gap-2"><ImageIcon size={12} /> Unggah Bukti Transfer</label>
                <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 hover:border-sky-600 transition-all relative overflow-hidden">
                   {formData.proofImage ? (
                     <div className="text-center relative z-10">
                        <CheckCircle size={40} className="mx-auto mb-4 text-green-500" />
                        <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">BUKTI BERHASIL DIPILIH</p>
                        <button type="button" onClick={() => setFormData({...formData, proofImage: ""})} className="mt-4 text-[9px] text-red-500 font-bold hover:underline">GANTI FILE</button>
                     </div>
                   ) : (
                     <div className="text-center relative z-10">
                        <Upload size={40} className="mx-auto mb-4 text-gray-300" />
                        <input 
                          type="file" 
                          accept="image/*"
                          required
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const uploadData = new FormData();
                              uploadData.append("file", file);
                              const res = await axios.post("/api/upload", uploadData);
                              setFormData({...formData, proofImage: res.data.url});
                            }
                          }}
                          className="text-xs text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:text-[10px] file:font-black file:bg-sky-600 file:text-white cursor-pointer shadow-lg active:scale-95"
                        />
                        <p className="mt-4 text-[9px] text-gray-400 font-bold uppercase tracking-widest">AMBIL FOTO ATAU UNGGAH SCREENSHOT</p>
                     </div>
                   )}
                </div>
              </div>

              <div className="bg-sky-50 p-6 rounded-2xl border border-sky-100">
                 <p className="text-sky-700 text-[10px] font-black uppercase tracking-widest mb-2">Instruksi:</p>
                 <p className="text-xs text-sky-600 leading-relaxed font-medium">Harap sertakan screenshot struk transfer yang jelas. Admin akan melakukan verifikasi maksimal 1x24 jam.</p>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-black py-6 rounded-3xl flex items-center justify-center gap-3 shadow-xl shadow-sky-100 transition-all uppercase tracking-widest text-lg">
                  <Save size={24} /> KIRIM KONFIRMASI
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
