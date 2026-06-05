"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowRight } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Nama terlalu pendek"),
  whatsapp: z.string().min(10, "Nomor WhatsApp tidak valid"),
  program: z.string(),
});

type FormData = z.infer<typeof schema>;

export default function LeadCapture() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    const message = `Halo Admin EA, saya ${data.name} ingin mendaftar Free Trial untuk program ${data.program}. Nomor WA saya ${data.whatsapp}.`;
    const whatsappUrl = `https://wa.me/6283120347713?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <section id="daftar" className="py-24 lg:py-40 bg-gray-50/50 transition-colors relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-200 to-transparent"></div>
      
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="bg-white rounded-[3rem] lg:rounded-[5rem] p-8 lg:p-24 shadow-ultra text-gray-800 flex flex-col lg:flex-row items-stretch gap-12 lg:gap-24 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 lg:w-64 h-32 lg:h-64 bg-sky-50 rounded-bl-[5rem] lg:rounded-bl-[10rem] -z-10"></div>
          
          <div className="lg:w-1/2 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 text-sky-600 font-black uppercase tracking-[0.3em] lg:tracking-[0.4em] text-[9px] lg:text-[10px] mb-6 lg:mb-8"
            >
              <div className="w-8 lg:w-10 h-0.5 bg-sky-600"></div>
              Admission Open
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black mb-8 lg:mb-10 text-gray-950 leading-[1] lg:leading-[0.9] tracking-[-0.04em]">
              Daftar Kelas <br /><span className="text-sky-600 italic">Free Trial</span>
            </h2>
            
            <p className="text-lg lg:text-2xl text-gray-400 mb-10 lg:mb-14 font-medium leading-relaxed italic border-l-4 border-sky-100 pl-6 lg:pl-8">
              Langkah pertama menuju keberanian beraksi. Biarkan anak Anda merasakan serunya belajar.
            </p>
            
            <div className="space-y-8 lg:space-y-10">
              <div className="flex items-center gap-6 lg:gap-8 group">
                <div className="bg-sky-50 p-4 lg:p-6 rounded-2xl lg:rounded-[2rem] text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-all duration-500 shadow-sm">
                  <svg className="w-8 h-8 lg:w-10 lg:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-black text-gray-950 text-lg lg:text-xl tracking-tight">Jam Operasional</p>
                  <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[9px] lg:text-[10px] mt-1">Senin - Minggu, 09.00 - 17.00 WIB</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 lg:gap-8 group">
                <div className="bg-sky-50 p-4 lg:p-6 rounded-2xl lg:rounded-[2rem] text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-all duration-500 shadow-sm">
                  <svg className="w-8 h-8 lg:w-10 lg:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-black text-gray-950 text-lg lg:text-xl tracking-tight">Lokasi Kami</p>
                  <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[9px] lg:text-[10px] mt-1">Ds. Asem, Kab. Cirebon</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 w-full bg-gray-50/50 p-8 lg:p-16 rounded-[3rem] lg:rounded-[4rem] border border-gray-100 shadow-inner relative">
            <div className="absolute -top-4 lg:-top-6 -right-4 lg:-right-6 w-16 lg:w-20 h-16 lg:h-20 bg-sky-600 rounded-full flex items-center justify-center text-white shadow-xl rotate-12 font-black text-[10px] lg:text-xs text-center leading-none">FREE<br />TRIAL</div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 lg:space-y-8">
              <div>
                <label className="block text-[9px] lg:text-[10px] font-black mb-3 lg:mb-4 text-gray-400 uppercase tracking-[0.3em] px-2">Nama Orang Tua</label>
                <input 
                  {...register("name")}
                  className="w-full px-6 lg:px-8 py-4 lg:py-6 rounded-2xl lg:rounded-[2rem] border-2 border-transparent bg-white text-gray-950 focus:border-sky-600 outline-none transition-all shadow-premium font-bold text-base lg:text-lg placeholder:text-gray-300" 
                  placeholder="Ibu Siti"
                />
                {errors.name && <p className="text-red-500 text-[10px] mt-2 px-4 font-bold">{errors.name.message}</p>}
              </div>
              
              <div>
                <label className="block text-[9px] lg:text-[10px] font-black mb-3 lg:mb-4 text-gray-400 uppercase tracking-[0.3em] px-2">Nomor WhatsApp</label>
                <input 
                  {...register("whatsapp")}
                  className="w-full px-6 lg:px-8 py-4 lg:py-6 rounded-2xl lg:rounded-[2rem] border-2 border-transparent bg-white text-gray-950 focus:border-sky-600 outline-none transition-all shadow-premium font-bold text-base lg:text-lg placeholder:text-gray-300" 
                  placeholder="0831xxxx"
                />
                {errors.whatsapp && <p className="text-red-500 text-[10px] mt-2 px-4 font-bold">{errors.whatsapp.message}</p>}
              </div>
              
              <div>
                <label className="block text-[9px] lg:text-[10px] font-black mb-3 lg:mb-4 text-gray-400 uppercase tracking-[0.3em] px-2">Pilih Program</label>
                <div className="relative">
                  <select 
                    {...register("program")}
                    className="w-full px-6 lg:px-8 py-4 lg:py-6 rounded-2xl lg:rounded-[2rem] border-2 border-transparent bg-white text-gray-950 focus:border-sky-600 outline-none transition-all shadow-premium font-bold text-base lg:text-lg appearance-none cursor-pointer"
                  >
                    <option>Bahasa Inggris</option>
                    <option>Matematika</option>
                    <option>Calistung</option>
                    <option>PRISMA</option>
                    <option>Preschool</option>
                  </select>
                  <div className="absolute right-6 lg:right-8 top-1/2 -translate-y-1/2 pointer-events-none text-sky-600">
                    <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
              
              <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-black py-5 lg:py-7 rounded-2xl lg:rounded-[2.5rem] transition-all shadow-ultra hover:shadow-sky-200 transform hover:-translate-y-2 mt-6 lg:mt-8 text-base lg:text-xl uppercase tracking-[0.2em] flex items-center justify-center gap-3 lg:gap-4">
                Kirim WhatsApp <ArrowRight size={24} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
