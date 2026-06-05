import { prisma } from "@/lib/prisma";
import { Users, GraduationCap, Calendar, CreditCard, Star } from "lucide-react";

export default async function AdminDashboard() {
  let studentCount = 0;
  let tutorCount = 0;
  let activeBookings = 0;

  try {
    studentCount = await prisma.student.count();
    tutorCount = await prisma.user.count({ where: { role: 'TUTOR' } });
    activeBookings = await prisma.classBooking.count({ where: { status: 'SCHEDULED' } });
  } catch (e) {
    console.error("Dashboard DB Error:", e);
  }
  
  let totalIncome = 0;
  let totalExpense = 0;

  try {
    const transactions = await prisma.transaction.findMany();
    totalIncome = transactions.filter(t => t.type === "INCOME").reduce((acc, curr) => acc + curr.amount, 0);
    totalExpense = transactions.filter(t => t.type === "EXPENSE").reduce((acc, curr) => acc + curr.amount, 0);
  } catch (e) {
    console.error("Finance Stats Error:", e);
  }

  const stats = [
    { name: "Total Siswa", value: studentCount, icon: GraduationCap, color: "bg-blue-500" },
    { name: "Total Tutor", value: tutorCount, icon: Users, color: "bg-purple-500" },
    { name: "Pemasukan", value: `Rp ${totalIncome.toLocaleString()}`, icon: CreditCard, color: "bg-green-500" },
    { name: "Sesi Aktif", value: activeBookings, icon: Calendar, color: "bg-orange-500" },
  ];

  const activePrograms = await prisma.program.findMany({
    include: {
      _count: {
        select: { bookings: { where: { status: 'SCHEDULED' } } }
      }
    }
  });

  return (
    <div className="space-y-12 animate-fade">
      {/* Top Rated Badge for Admin */}
      <div className="bg-sky-600 p-8 rounded-[3rem] shadow-ultra text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-bl-full -z-0 group-hover:scale-110 transition-transform duration-700"></div>
         <div className="flex items-center gap-8 relative z-10">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-2xl">
               <Star size={40} fill="white" />
            </div>
            <div>
               <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none mb-2">Top <span className="text-sky-200">Rated</span></h2>
               <p className="text-xs font-bold uppercase tracking-[0.3em] text-sky-100">Excellence in Cirebon Education</p>
            </div>
         </div>
         <div className="bg-white/20 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/30 relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest text-sky-100 mb-1">Status Sistem</p>
            <p className="text-lg font-black uppercase italic tracking-tighter">Operational & Stable</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className={`${stat.color} p-4 rounded-2xl text-white`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-6">Program Aktif</h3>
          <div className="space-y-4">
            {activePrograms.map((prog) => (
              <div key={prog.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="font-medium text-gray-700">{prog.name}</span>
                <span className="bg-sky-100 text-sky-600 px-4 py-1 rounded-full text-sm font-bold">{prog._count.bookings} Sesi Aktif</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-6">Aktivitas Terkini</h3>
          <div className="text-gray-400 text-center py-12 italic text-sm">
            Belum ada aktivitas baru hari ini.
          </div>
        </div>
      </div>
    </div>
  );
}
