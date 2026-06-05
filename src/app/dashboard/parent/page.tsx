import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GraduationCap, Calendar, CreditCard } from "lucide-react";
import Link from "next/link";

export default async function ParentDashboard() {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  let students: any[] = [];

  try {
    students = await prisma.student.findMany({
      where: { parentId: userId },
      include: {
        bookings: {
          where: { status: 'SCHEDULED' },
          include: { tutor: true, program: true },
          take: 3,
          orderBy: { date: 'asc' },
        },
      },
    });
  } catch (e) {
    console.error("Parent Dashboard DB Error:", e);
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <GraduationCap className="text-sky-600" />
              Anak Saya
            </h3>
            <button className="text-sky-600 font-bold text-sm hover:underline transition">+ Tambah Siswa</button>
          </div>
          <div className="space-y-4">
            {students.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400 italic font-medium">
                Belum ada data siswa.
              </div>
            ) : (
              students.map((student) => (
                <div key={student.id} className="p-6 bg-sky-50 rounded-[1.5rem] border border-sky-100">
                  <p className="font-black text-sky-900 text-lg">{student.name}</p>
                  <p className="text-sm text-sky-600 mb-4 font-bold uppercase tracking-wider">Lahir: {new Date(student.dateOfBirth).toLocaleDateString('id-ID')}</p>
                  
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest">Jadwal Terdekat</p>
                    {student.bookings.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">Belum ada jadwal.</p>
                    ) : (
                      student.bookings.map((booking: any) => (
                        <div key={booking.id} className="flex justify-between items-center bg-white p-3 px-4 rounded-xl shadow-sm text-sm border border-sky-100">
                          <span className="font-bold text-gray-700">{booking.program.name}</span>
                          <span className="text-sky-600 font-bold">{new Date(booking.date).toLocaleDateString('id-ID')}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Calendar className="text-sky-600" />
              Booking Cepat
            </h3>
            <p className="text-gray-500 mb-6 text-sm font-medium">Pilih tutor dan waktu yang tersedia untuk sesi belajar selanjutnya secara fleksibel.</p>
            <Link 
              href="/dashboard/parent/booking"
              className="block w-full text-center bg-sky-600 hover:bg-sky-700 text-white font-black py-4 rounded-2xl transition shadow-lg shadow-sky-100 transform active:scale-95"
            >
              CARI JADWAL TUTOR
            </Link>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CreditCard className="text-sky-600" />
              Tagihan SPP
            </h3>
            <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-orange-600 font-black uppercase tracking-wider mb-1">Total Tunggakan</p>
                  <p className="text-2xl font-black text-orange-900">Rp 0</p>
                </div>
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl font-black text-sm shadow-md transition transform active:scale-95">BAYAR</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
