"use client";

import { useState, useEffect } from "react";
import { Search, Users, Copy, Check, Shield, User as UserIcon, Plus, X, Save, Mail, Phone, Lock, Edit3, Trash2 } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [search, setSearch] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT_PARENT",
    phoneNumber: ""
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await axios.patch("/api/admin/users", { id: editingUser.id, ...formData });
      } else {
        await axios.post("/api/admin/users", formData);
      }
      setModalOpen(false);
      setEditingUser(null);
      setFormData({ name: "", email: "", password: "", role: "STUDENT_PARENT", phoneNumber: "" });
      fetchUsers();
    } catch (err) {
      alert("Gagal menyimpan user.");
    }
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      name: user.name || "",
      email: user.email,
      password: "", // Jangan tampilkan password lama
      role: user.role,
      phoneNumber: user.phoneNumber || ""
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus user ini secara permanen?")) return;
    try {
      await axios.delete(`/api/admin/users?id=${id}`);
      fetchUsers();
    } catch (err) {
      alert("Gagal menghapus user.");
    }
  };

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-gray-950 tracking-tighter uppercase italic">Manajemen User</h1>
          <p className="text-gray-500 font-medium">Data seluruh pengguna sistem (Admin, Tutor, & Orang Tua)</p>
        </div>
        <button 
          onClick={() => { setEditingUser(null); setFormData({ name: "", email: "", password: "", role: "STUDENT_PARENT", phoneNumber: "" }); setModalOpen(true); }}
          className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white font-black py-4 px-8 rounded-2xl flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all text-xs"
        >
          <Plus size={20} strokeWidth={3} /> TAMBAH USER BARU
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-ultra overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col md:row justify-between items-center gap-6 bg-gray-50/30">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-3.5 rounded-xl border border-gray-200 bg-white outline-none focus:border-sky-600 font-bold text-sm shadow-sm" 
              placeholder="Cari nama, email, atau ID..." 
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Nama & Email</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Role</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">User ID</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={4} className="px-8 py-20 text-center animate-pulse text-gray-400 font-black tracking-widest text-xs uppercase">MENYELARASKAN DATA USER...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={4} className="px-8 py-20 text-center text-gray-400 italic font-medium">Tidak ada user ditemukan.</td></tr>
              ) : filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600">
                        {user.role === "ADMIN" ? <Shield size={24} /> : <UserIcon size={24} />}
                      </div>
                      <div>
                        <p className="font-black text-gray-800">{user.name || "No Name"}</p>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${user.role === "ADMIN" ? "bg-purple-100 text-purple-600 border border-purple-200" : user.role === "TUTOR" ? "bg-blue-100 text-blue-600" : "bg-orange-100 text-orange-600"}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                       <code className="bg-gray-100 px-3 py-1.5 rounded-lg text-xs font-mono text-gray-600">{user.id}</code>
                       <button 
                        onClick={() => copyToClipboard(user.id)}
                        className="p-2 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-sky-600 transition-colors shadow-sm"
                       >
                         {copiedId === user.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                       </button>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(user)} className="p-3 bg-sky-50 text-sky-600 rounded-xl hover:bg-sky-600 hover:text-white transition-all shadow-sm"><Edit3 size={18} /></button>
                      <button onClick={() => handleDelete(user.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Modal */}
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
                <h3 className="text-2xl font-black text-gray-950 uppercase tracking-tighter italic">{editingUser ? "Edit User" : "User Baru"}</h3>
                <p className="text-gray-500 font-medium text-xs">{editingUser ? "Perbarui data pengguna sistem." : "Tambahkan Admin, Tutor, atau Orang Tua."}</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">Nama Lengkap</label>
                <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-sky-600 outline-none transition-all font-bold text-gray-900" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">Email</label>
                <div className="relative">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                   <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-sky-600 outline-none transition-all font-bold text-gray-900" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">Role</label>
                  <select 
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-sky-600 outline-none transition-all font-bold appearance-none cursor-pointer"
                  >
                    <option value="STUDENT_PARENT">Orang Tua</option>
                    <option value="TUTOR">Tutor</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">Password {editingUser && "(Kosongkan jika tetap)"}</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input required={!editingUser} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-sky-600 outline-none transition-all font-bold text-gray-900" placeholder={editingUser ? "********" : "password123"} />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">Nomor WhatsApp</label>
                <div className="relative">
                   <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                   <input value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-sky-600 outline-none transition-all font-bold text-gray-900" placeholder="08xxxx" />
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-black py-6 rounded-3xl flex items-center justify-center gap-3 shadow-xl shadow-sky-100 transition-all uppercase tracking-widest text-lg">
                  <Save size={24} /> {editingUser ? "PERBARUI USER" : "SIMPAN USER"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
