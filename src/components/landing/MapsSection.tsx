"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import { MapPin, Globe, ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function MapsSection() {
  const [locations, setLocations] = useState<any[]>([]);

  useEffect(() => {
    axios.get("/api/admin/locations").then(res => setLocations(res.data));
  }, []);

  return (
    <section className="py-24 lg:py-40 bg-white relative overflow-hidden">
      {/* Ensure light background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-50 rounded-full blur-[120px] opacity-60"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between mb-16 lg:mb-24 gap-8 text-center lg:text-left">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 text-sky-600 font-black uppercase tracking-[0.3em] lg:tracking-[0.4em] text-[9px] lg:text-[10px] mb-6"
            >
              <div className="w-8 lg:w-10 h-0.5 bg-sky-200"></div>
              Our Presence
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl lg:text-8xl font-black text-gray-950 tracking-[-0.04em] leading-tight lg:leading-none"
            >
              Lokasi <span className="text-sky-600 italic">Cabang EA</span>
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-lg lg:text-xl text-gray-400 font-medium italic lg:text-right max-w-sm"
          >
            Temukan pusat bimbingan belajar terdekat untuk konsultasi gratis.
          </motion.p>
        </div>

        {/* Auto Sliding Locations */}
        <div className="relative mb-20">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="pb-16 !overflow-visible"
          >
            {locations.length === 0 ? (
              <SwiperSlide>
                <div className="bg-white p-10 rounded-[3rem] shadow-ultra border border-sky-100 relative overflow-hidden group h-full">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-sky-50 rounded-bl-full -z-10 opacity-50 transition-transform duration-700 group-hover:scale-150"></div>
                   <div className="w-16 h-16 bg-sky-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-sky-100 group-hover:rotate-12 transition-transform">
                      <MapPin size={32} strokeWidth={2.5} />
                   </div>
                   <h3 className="text-2xl font-black text-gray-950 mb-4 tracking-tight">EA Pusat</h3>
                   <p className="text-gray-500 font-medium text-sm leading-relaxed mb-8">Lemahabang, Kab. Cirebon</p>
                   <span className="text-sky-600 font-black uppercase tracking-widest text-[10px] flex items-center gap-2">UTAMA <ArrowRight size={14} /></span>
                </div>
              </SwiperSlide>
            ) : (
              locations.map((loc: any) => (
                <SwiperSlide key={loc.id}>
                  <div className="bg-white p-10 rounded-[3rem] shadow-ultra border border-sky-100 relative overflow-hidden group hover:-translate-y-2 transition-all duration-500 h-full">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-sky-50 rounded-bl-full -z-10 opacity-50 transition-transform duration-700 group-hover:scale-150"></div>
                    <div className="w-16 h-16 bg-sky-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-sky-100 group-hover:rotate-12 transition-transform">
                      <MapPin size={32} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-950 mb-2 tracking-tight line-clamp-1">{loc.name}</h3>
                    <p className="text-gray-500 font-medium text-sm leading-relaxed mb-8 line-clamp-2 h-10">{loc.address}</p>
                    
                    <a 
                      href={loc.mapsUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sky-600 font-black uppercase tracking-widest text-[10px] hover:underline"
                    >
                      LIHAT DI MAPS <Globe size={14} />
                    </a>
                  </div>
                </SwiperSlide>
              ))
            )}
          </Swiper>
        </div>

        {/* Unified Map View */}
        <div className="bg-white rounded-[4rem] lg:rounded-[5rem] overflow-hidden shadow-ultra border border-sky-100 relative group">
          <div className="h-[400px] lg:h-[600px] relative">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15848.471649232815!2d108.618!3d-6.816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNDknMDAuMCJTIDEwOMKwMzcnMDAuMCJF!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Maps English Action"
              className="contrast-[1.1] brightness-[1.05] transition-all duration-700"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
