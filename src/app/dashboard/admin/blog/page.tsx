"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit3, Trash2, X, Save, Image as ImageIcon } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";

export default function AdminBlog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setMobileOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
    published: true
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("/api/admin/blog");
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPost) {
        await axios.patch("/api/admin/blog", { id: editingPost.id, ...formData });
      } else {
        await axios.post("/api/admin/blog", formData);
      }
      setMobileOpen(false);
      setEditingPost(null);
      setFormData({ title: "", content: "", image: "", published: true });
      fetchPosts();
    } catch (err) {
      alert("Gagal menyimpan artikel");
    }
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      image: post.image || "",
      published: post.published
    });
    setMobileOpen(true);
  };

  const deletePost = async (id: string) => {
    if (!confirm("Hapus artikel ini secara permanen?")) return;
    try {
      await axios.delete(`/api/admin/blog?id=${id}`);
      fetchPosts();
    } catch (err) {
      alert("Gagal menghapus");
    }
  };

  return (
    <div className="space-y-8 animate-fade">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-gray-950 tracking-tighter">Kelola Blog & Berita</h1>
          <p className="text-gray-500 font-medium">Manajemen artikel edukasi dan pengumuman English Action</p>
        </div>
        <button 
          onClick={() => { setEditingPost(null); setFormData({ title: "", content: "", image: "", published: true }); setMobileOpen(true); }}
          className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white font-black py-4 px-8 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-sky-100 transition-all active:scale-95"
        >
          <Plus size={20} strokeWidth={3} />
          BUAT ARTIKEL BARU
        </button>
      </div>

      {/* Blog List Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-ultra overflow-hidden">
        <div className="p-6 lg:p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-gray-50/30">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input className="w-full pl-12 pr-6 py-3.5 rounded-xl border border-gray-200 bg-white outline-none focus:border-sky-600 font-bold text-sm shadow-sm" placeholder="Cari judul artikel..." />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Artikel</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Tanggal Rilis</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Navigasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={4} className="px-8 py-20 text-center animate-pulse text-gray-400 font-black tracking-widest text-xs uppercase">MENYELARASKAN ARTIKEL...</td></tr>
              ) : posts.length === 0 ? (
                <tr><td colSpan={4} className="px-8 py-20 text-center text-gray-400 italic font-medium bg-gray-50/30">Belum ada artikel yang diterbitkan.</td></tr>
              ) : posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-sky-100 rounded-xl flex-shrink-0 overflow-hidden border-2 border-white shadow-sm">
                        {post.image ? <img src={post.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-sky-600 font-black">EA</div>}
                      </div>
                      <span className="font-black text-gray-800 line-clamp-1">{post.title}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-gray-400 font-bold text-sm">
                    {new Date(post.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${post.published ? "bg-green-100 text-green-600 border border-green-200" : "bg-orange-100 text-orange-600 border border-orange-200"}`}>
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(post)} className="p-3 bg-sky-50 text-sky-600 rounded-xl hover:bg-sky-600 hover:text-white transition-all shadow-sm"><Edit3 size={18} /></button>
                      <button onClick={() => deletePost(post.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setMobileOpen(false)}></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-4xl rounded-[3rem] shadow-ultra relative z-10 overflow-hidden border-4 border-white"
          >
            <div className="p-8 lg:p-12 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-2xl font-black text-gray-950 uppercase tracking-tighter">{editingPost ? "Edit Artikel" : "Tulis Artikel Baru"}</h3>
                <p className="text-gray-500 font-medium text-sm">Gunakan bahasa yang menarik dan informatif.</p>
              </div>
              <button onClick={() => setMobileOpen(false)} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm hover:bg-red-50 hover:text-red-500 transition-all border border-gray-100"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 lg:p-12 space-y-8 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">Judul Artikel</label>
                    <input 
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-sky-600 outline-none transition-all font-bold text-gray-900" 
                      placeholder="Contoh: 5 Tips Belajar Bahasa Inggris..."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1 flex items-center gap-2"><ImageIcon size={12} /> Upload Gambar Cover</label>
                    <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-2xl border-2 border-gray-100">
                      <div className="w-24 h-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                        {formData.image ? <img src={formData.image} className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-gray-300" />}
                      </div>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const uploadData = new FormData();
                            uploadData.append("file", file);
                            const res = await axios.post("/api/upload", uploadData);
                            setFormData({...formData, image: res.data.url});
                          }
                        }}
                        className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-sky-50 file:text-sky-600 cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border-2 border-gray-100">
                    <input 
                      type="checkbox"
                      id="published"
                      checked={formData.published}
                      onChange={(e) => setFormData({...formData, published: e.target.checked})}
                      className="w-6 h-6 accent-sky-600"
                    />
                    <label htmlFor="published" className="font-black text-gray-700 text-sm uppercase tracking-widest cursor-pointer">Terbitkan Sekarang</label>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">Konten Artikel</label>
                  <textarea 
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    className="w-full h-64 lg:h-full min-h-[250px] px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-sky-600 outline-none transition-all font-medium text-gray-700 leading-relaxed" 
                    placeholder="Tulis isi artikel di sini..."
                  ></textarea>
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-black py-6 rounded-3xl flex items-center justify-center gap-3 shadow-xl shadow-sky-100 transition-all uppercase tracking-widest text-lg active:scale-95">
                  <Save size={24} /> SIMPAN ARTIKEL
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
