"use client";

import { useState, useEffect } from "react";
import { GraduationCap, Calendar, User as UserIcon, BookOpen, FileText, Download, Star } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";

export default function ParentReports() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/parent/reports").then(res => {
      setReports(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-10 animate-fade">
      <div>
        <h1 className="text-3xl lg:text-4xl font-black text-gray-950 tracking-tighter uppercase italic">Rapor Akademik</h1>
        <p className="text-gray-500 font-medium">Pantau perkembangan belajar dan evaluasi hasil belajar anak Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {loading ? (
          <div className="col-span-full text-center py-20 animate-pulse text-gray-400 font-black tracking-widest text-xs uppercase">MENYELARASKAN DATA RAPOR...</div>
        ) : reports.length === 0 ? (
          <div className="col-span-full text-center py-20 text-gray-400 italic font-medium bg-white rounded-[3rem] border border-dashed border-gray-200">Belum ada laporan perkembangan yang tersedia.</div>
        ) : reports.map((report) => (
          <div key={report.id} className="bg-white p-10 rounded-[3rem] shadow-ultra border border-gray-100 group relative overflow-hidden transition-all hover:-translate-y-2">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-bl-[4rem] -z-10 group-hover:scale-125 transition-transform duration-700 opacity-60"></div>
            
            <div className="flex items-center gap-6 mb-10 pb-6 border-b border-gray-50">
              <div className="w-16 h-16 bg-sky-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-sky-100 group-hover:rotate-6 transition-transform">
                <GraduationCap size={32} />
              </div>
              <div>
                <p className="font-black text-2xl text-gray-950 tracking-tight">{report.student.name}</p>
                <p className="text-sky-600 font-black uppercase tracking-widest text-[10px]">{report.program.name}</p>
              </div>
            </div>

            <div className="space-y-6">
               <div className="flex items-center gap-4 text-gray-400">
                  <Calendar size={16} />
                  <p className="text-sm font-bold">{new Date(report.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
               </div>
               <div className="flex items-center gap-4 text-gray-400">
                  <UserIcon size={16} />
                  <p className="text-sm font-bold italic">Tutor: {report.tutor.name}</p>
               </div>
               
               <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Star size={12} className="text-yellow-400" /> Catatan Perkembangan</p>
                  <p className="text-gray-700 font-medium leading-relaxed italic line-clamp-3 group-hover:line-clamp-none transition-all duration-500">
                    &quot;{report.report || "Siswa menunjukkan peningkatan yang baik dalam pemahaman konsep dan sangat aktif di kelas."}&quot;
                  </p>
               </div>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-50 flex justify-between items-center">
               <button className="inline-flex items-center gap-2 text-sky-600 font-black uppercase tracking-widest text-[10px] hover:underline">
                  LIHAT DETAIL <FileText size={14} />
               </button>
               <button className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:bg-sky-600 hover:text-white transition-all shadow-sm">
                  <Download size={18} />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
