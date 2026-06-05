"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Printer } from "lucide-react";

export default function PrintInvoice() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/admin/billing").then(res => {
      const inv = res.data.find((i: any) => i.id === id);
      setInvoice(inv);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="p-20 text-center">Memuat invoice...</div>;
  if (!invoice) return <div className="p-20 text-center text-red-500 font-bold">Invoice tidak ditemukan.</div>;

  return (
    <div className="bg-white min-h-screen p-10 text-gray-900 font-serif">
      <div className="max-w-4xl mx-auto border-2 border-gray-100 p-16 relative overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-start mb-20">
          <div>
            <h1 className="text-4xl font-black text-sky-600 mb-2">ENGLISH ACTION</h1>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Bimbingan Belajar Multidisiplin</p>
            <p className="text-xs text-gray-400 mt-4 leading-relaxed">
              Ds. Asem Kec. Lemahabang, Kab. Cirebon<br />
              WhatsApp: 0831 2034 7713<br />
              Email: admin@ea-cirebon.com
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-5xl font-black text-gray-200 mb-4 tracking-tighter uppercase">INVOICE</h2>
            <p className="text-sm font-bold text-gray-700">NO: #INV-{invoice.id.slice(-6).toUpperCase()}</p>
            <p className="text-xs text-gray-400 mt-2 font-bold">{new Date(invoice.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>

        {/* Info */}
        <div className="grid grid-cols-2 gap-20 mb-20 border-y border-gray-50 py-10">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Ditagihkan Kepada:</p>
            <p className="font-black text-xl text-gray-800">Orang Tua Siswa</p>
            <p className="text-sm text-gray-500 mt-2 italic">ID: {invoice.parentId}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Jatuh Tempo:</p>
            <p className="font-black text-xl text-red-600">{new Date(invoice.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>

        {/* Items */}
        <table className="w-full text-left mb-20">
          <thead className="border-b-2 border-gray-100">
            <tr>
              <th className="py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Deskripsi Layanan</th>
              <th className="py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Jumlah</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            <tr>
              <td className="py-8">
                <p className="font-black text-gray-800">{invoice.description || "Pembayaran Bimbingan Belajar"}</p>
                <p className="text-xs text-gray-400 mt-2">Biaya operasional & pendidikan siswa</p>
              </td>
              <td className="py-8 text-right font-black text-gray-800">
                Rp {invoice.amount.toLocaleString()}
              </td>
            </tr>
          </tbody>
          <tfoot>
             <tr className="border-t-4 border-sky-600 bg-sky-50">
                <td className="py-6 px-4 font-black text-sky-900 text-lg uppercase tracking-widest">Total Pembayaran</td>
                <td className="py-6 px-4 text-right font-black text-sky-600 text-2xl">
                  Rp {invoice.amount.toLocaleString()}
                </td>
             </tr>
          </tfoot>
        </table>

        {/* Footer Print */}
        <div className="grid grid-cols-2 gap-20 pt-10 mt-20 border-t border-gray-50">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-10">Metode Pembayaran:</p>
            <p className="text-xs font-bold text-gray-700">Bank Transfer / Cash</p>
            <p className="text-[10px] text-gray-400 mt-2 leading-relaxed italic">
              Harap melampirkan bukti transfer saat melakukan konfirmasi di panel orang tua atau via WhatsApp Admin.
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-16">Hormat Kami,</p>
            <div className="w-40 h-px bg-gray-200 mx-auto mb-4"></div>
            <p className="text-xs font-black text-gray-800 uppercase tracking-[0.2em]">Management EA</p>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-600/5 -rotate-45 translate-x-16 -translate-y-16"></div>
      </div>

      <div className="fixed bottom-10 right-10 print:hidden flex gap-4">
        <button 
          onClick={() => window.print()}
          className="bg-sky-600 text-white p-5 rounded-full shadow-2xl hover:scale-110 transition-all flex items-center gap-3 font-black uppercase tracking-widest text-xs"
        >
          <Printer size={24} /> CETAK SEKARANG
        </button>
      </div>
    </div>
  );
}
