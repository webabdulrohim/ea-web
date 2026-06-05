"use client";

import { useState, useEffect } from "react";
import { Plus, Search, GraduationCap, Download, Upload, X, Save, User as UserIcon, Calendar, Edit3, Trash2 } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AdminStudents() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [search, setSearch] = useState("");
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    grade: "",
    school: "",
    parentId: ""
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("/api/admin/students");
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await axios.patch("/api/admin/students", { id: editingStudent.id, ...formData });
      } else {
        await axios.post("/api/admin/students", formData);
      }
      setModalOpen(false);
      setEditingStudent(null);
      setFormData({ name: "", dateOfBirth: "", grade: "", school: "", parentId: "" });
      fetchStudents();
    } catch (err) {
      alert("Gagal menyimpan data siswa.");
    }
  };

  const handleEdit = (student: any) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      dateOfBirth: student.dateOfBirth.split('T')[0],
      grade: student.grade || "",
      school: student.school || "",
      parentId: student.parentId
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus data siswa ini secara permanen?")) return;
    try {
      await axios.delete(`/api/admin/students?id=${id}`);
      fetchStudents();
    } catch (err) {
      alert("Gagal menghapus data siswa.");
    }
  };

  const exportToCSV = () => {
    const headers = ["Nama", "Tgl Lahir", "Kelas", "Sekolah", "Status"];
    const rows = students.map(s => [s.name, s.dateOfBirth, s.grade, s.school, s.status]);
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "data_siswa_ea.csv");
    document.body.appendChild(link);
    link.click();
  };

  const importFromCSV = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        alert("Simulasi: Memproses file " + file.name + ". Data akan ditambahkan ke antrian sinkronisasi.");
      }
    };
    input.click();
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.school?.toLowerCase().includes(search.toLowerCase()) ||
    s.parent?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-gray-950 tracking-tighter uppercase">Manajemen Siswa</h1>
          <p className="text-gray-500 font-medium">Data seluruh peserta didik English Action</p>
        </div>
        <div className="flex flex-wrap gap-4 w-full sm:w-auto">
          <button onClick={exportToCSV} className="flex-1 sm:flex-none bg-white text-gray-600 font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 border border-gray-100 shadow-sm hover:bg-gray-50 transition-all text-xs">
            <Download size={20} /> EXPORT
          </button>
          <button onClick={importFromCSV} className="flex-1 sm:flex-none bg-white text-gray-600 font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 border border-gray-100 shadow-sm hover:bg-gray-50 transition-all text-xs">
            <Upload size={20} /> IMPORT
          </button>
          <button 
            onClick={() => { setEditingStudent(null); setFormData({ name: "", dateOfBirth: "", grade: "", school: "", parentId: "" }); setModalOpen(true); }}
            className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white font-black py-4 px-8 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-sky-100 transition-all active:scale-95 text-xs"
          >
            <Plus size={20} strokeWidth={3} /> DAFTAR SISWA
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-ultra overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col md:row justify-between items-center gap-6 bg-gray-50/30">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-3.5 rounded-xl border border-gray-200 bg-white outline-none focus:border-sky-600 font-bold text-sm shadow-sm" 
              placeholder="Cari nama siswa atau sekolah..." 
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Siswa</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Pendidikan</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Orang Tua</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="px-8 py-20 text-center animate-pulse text-gray-400 font-black tracking-widest text-xs uppercase">MENYELARASKAN DATA SISWA...</td></tr>
              ) : filteredStudents.length === 0 ? (
                <tr><td colSpan={5} className="px-8 py-20 text-center text-gray-400 italic font-medium">Belum ada siswa ditemukan.</td></tr>
              ) : filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600">
                        <UserIcon size={24} />
                      </div>
                      <div>
                        <p className="font-black text-gray-800">{student.name}</p>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{new Date(student.dateOfBirth).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-bold text-gray-700">{student.grade || "-"}</p>
                    <p className="text-gray-400 text-xs font-medium">{student.school || "-"}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-black text-gray-600">{student.parent?.name || "N/A"}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${student.status === "ACTIVE" ? "bg-green-100 text-green-600 border border-green-200" : "bg-red-100 text-red-600"}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(student)} className="p-3 bg-sky-50 text-sky-600 rounded-xl hover:bg-sky-600 hover:text-white transition-all shadow-sm"><Edit3 size={18} /></button>
                      <button onClick={() => handleDelete(student.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setModalOpen(false)}></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-2xl rounded-[3rem] shadow-ultra relative z-10 overflow-hidden border-4 border-white"
          >
            <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-2xl font-black text-gray-950 uppercase tracking-tighter italic">{editingStudent ? "Edit Data Siswa" : "Daftarkan Siswa"}</h3>
                <p className="text-gray-500 font-medium text-xs">{editingStudent ? "Perbarui informasi peserta didik." : "Tambah data peserta didik baru ke sistem."}</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm hover:bg-red-50 hover:text-red-500 transition-all border border-gray-100"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[60vh] overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">Nama Lengkap</label>
                  <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-sky-600 outline-none transition-all font-bold text-gray-900" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">Tanggal Lahir</label>
                  <input type="date" required value={formData.dateOfBirth} onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})} className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-sky-600 outline-none transition-all font-bold text-gray-900" />
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">Kelas / Tingkat</label>
                  <input value={formData.grade} onChange={(e) => setFormData({...formData, grade: e.target.value})} className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-sky-600 outline-none transition-all font-bold text-gray-900" placeholder="Contoh: 4 SD" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">Sekolah</label>
                  <input value={formData.school} onChange={(e) => setFormData({...formData, school: e.target.value})} className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-sky-600 outline-none transition-all font-bold text-gray-900" />
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="flex justify-between items-center mb-3 px-1">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">ID Orang Tua (Parent ID)</label>
                  <Link href="/dashboard/admin/users" className="text-[10px] text-sky-600 font-bold hover:underline uppercase tracking-widest">Cari ID di Manajemen User &rarr;</Link>
                </div>
                <input required value={formData.parentId} onChange={(e) => setFormData({...formData, parentId: e.target.value})} className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-sky-600 outline-none transition-all font-bold text-gray-900" placeholder="Contoh: clxxxx..." />
              </div>

              <div className="md:col-span-2 pt-4">
                <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-black py-6 rounded-3xl flex items-center justify-center gap-3 shadow-xl shadow-sky-100 transition-all uppercase tracking-widest text-lg">
                  <Save size={24} /> {editingStudent ? "PERBARUI DATA" : "SIMPAN DATA SISWA"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
