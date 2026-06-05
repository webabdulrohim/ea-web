"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Email atau password salah");
      } else {
        router.refresh();
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 lg:p-12 border-4 border-sky-600">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <div className="w-20 h-20 bg-sky-600 rounded-[1.5rem] flex items-center justify-center text-white text-3xl font-black mx-auto shadow-lg">EA</div>
          </Link>
          <h1 className="text-3xl font-black text-gray-900">Login Panel</h1>
          <p className="text-gray-500 mt-2 font-medium">Manajemen English Action</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-black text-gray-700 mb-2 px-1 uppercase tracking-wider">Email Address</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 bg-gray-50 text-gray-900 focus:border-sky-600 outline-none transition-all shadow-md font-bold text-lg"
              placeholder="admin@ea.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-black text-gray-700 mb-2 px-1 uppercase tracking-wider">Password</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 bg-gray-50 text-gray-900 focus:border-sky-600 outline-none transition-all shadow-md font-bold text-lg"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm text-center font-black bg-red-50 py-4 rounded-2xl border-2 border-red-100">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl hover:shadow-sky-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95 text-xl"
          >
            {loading ? "AUTHENTICATING..." : "LOGIN SEKARANG"}
          </button>
        </form>

        <p className="text-center mt-10 text-gray-400 text-xs uppercase tracking-[0.2em] font-black">
          English Action System
        </p>
      </div>
    </div>
  );
}
