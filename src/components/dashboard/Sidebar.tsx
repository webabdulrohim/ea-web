"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  LogOut,
  GraduationCap,
  Image as ImageIcon,
  Settings,
  Newspaper,
  MapPin,
  DollarSign,
  UserCheck
} from "lucide-react";

interface SidebarProps {
  role: string;
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    
    // Admin Management Menus
    ...(role === "ADMIN" ? [
      { name: "Siswa", href: "/dashboard/admin/students", icon: GraduationCap },
      { name: "Tutor", href: "/dashboard/admin/tutors", icon: Users },
      { name: "User & ID", href: "/dashboard/admin/users", icon: UserCheck },
      { name: "Tagihan", href: "/dashboard/admin/billing", icon: FileText },
      { name: "Keuangan", href: "/dashboard/admin/finance", icon: DollarSign },
      { name: "Lokasi", href: "/dashboard/admin/locations", icon: MapPin },
      { name: "Kelola Blog", href: "/dashboard/admin/blog", icon: Newspaper },
      { name: "Kelola Galeri", href: "/dashboard/admin/gallery", icon: ImageIcon },
      { name: "Pengaturan LP", href: "/dashboard/admin/settings", icon: Settings },
    ] : []),

    // Tutor Menus
    ...(role === "TUTOR" ? [
      { name: "Jadwal Saya", href: "/dashboard/tutor", icon: Calendar },
      // { name: "Input Absensi", href: "/dashboard/tutor/attendance", icon: FileText }, // Integrated in dashboard
    ] : []),

    // Parent/Student Menus
    ...(role === "STUDENT_PARENT" ? [
      { name: "Booking Kelas", href: "/dashboard/parent/booking", icon: Calendar },
      { name: "Rapor Akademik", href: "/dashboard/parent/reports", icon: GraduationCap },
      { name: "Pembayaran", href: "/dashboard/parent/billing", icon: FileText },
    ] : []),
  ];

  return (
    <div className="w-72 bg-white border-r border-gray-100 flex flex-col h-full transition-colors shadow-sm">
      <div className="p-8">
        <Link href="/" className="text-2xl font-black text-sky-900 flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center text-white shadow-lg">EA</div>
          <span className="tracking-tighter uppercase italic">English Action</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center space-x-3 px-5 py-4 rounded-2xl transition-all duration-200 ${
                isActive 
                ? "bg-sky-600 text-white shadow-lg shadow-sky-200 font-bold scale-[1.02]" 
                : "text-gray-500 hover:bg-sky-50 hover:text-sky-600"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] uppercase tracking-[0.2em] font-black">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-gray-50">
        <button 
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center space-x-3 px-5 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-black uppercase tracking-[0.3em] text-[10px]"
        >
          <LogOut size={20} />
          <span>Keluar Sistem</span>
        </button>
      </div>
    </div>
  );
}
