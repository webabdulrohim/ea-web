"use client";

import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Ibu Maya",
    role: "Orang Tua Siswa (Calistung)",
    text: "Anak saya jadi lebih percaya diri dan sudah lancar membaca hanya dalam 3 bulan di EA!",
  },
  {
    name: "Bapak Andi",
    role: "Orang Tua Siswa (Bahasa Inggris)",
    text: "Metode belajarnya sangat seru, anak saya selalu semangat setiap kali mau berangkat les ke EA.",
  },
  {
    name: "Ibu Rina",
    role: "Orang Tua Siswa (Preschool)",
    text: "Sangat terbantu dengan program Preschool EA. Anak saya jadi lebih aktif bersosialisasi dan motoriknya berkembang pesat.",
  },
  {
    name: "Bapak Budi",
    role: "Orang Tua Siswa (PRISMA)",
    text: "PRISMA di EA benar-benar membantu konsentrasi anak saya. Menghitung jadi jauh lebih cepat dan akurat.",
  },
];

export default function TestimonialSlider() {
  return (
    <section className="py-24 lg:py-40 bg-sky-50 transition-colors relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-200 to-transparent"></div>
      
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-5 lg:px-6 py-2 bg-white text-sky-600 rounded-full font-black text-[9px] lg:text-[10px] uppercase tracking-[0.3em] mb-6 lg:mb-8 shadow-sm"
          >
            Testimoni Orang Tua
          </motion.div>
          <h2 className="text-4xl lg:text-6xl font-black text-gray-950 tracking-tight leading-tight">Apa Kata Mereka?</h2>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 30 },
            1024: { slidesPerView: 3, spaceBetween: 40 },
          }}
          autoplay={{ delay: 4000 }}
          pagination={{ clickable: true }}
          className="pb-20 !overflow-visible"
        >
          {testimonials.map((t, idx) => (
            <SwiperSlide key={idx}>
              <div className="bg-white p-8 lg:p-12 rounded-[3rem] lg:rounded-[4rem] shadow-ultra border border-sky-100 h-full flex flex-col group hover:-translate-y-2 transition-all duration-500">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mb-8 lg:mb-10 group-hover:bg-sky-600 group-hover:text-white transition-colors duration-500">
                  <Quote size={32} />
                </div>
                <p className="text-lg lg:text-xl text-gray-500 mb-10 flex-grow italic leading-relaxed font-medium">
                  &quot;{t.text}&quot;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-black text-xs uppercase tracking-tighter shadow-inner">
                    {t.name.split(' ')[1]?.charAt(0) || t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-black text-gray-950 text-lg lg:text-xl tracking-tight leading-none mb-1">{t.name}</p>
                    <p className="text-sky-600 font-bold uppercase tracking-[0.2em] text-[9px]">{t.role}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
