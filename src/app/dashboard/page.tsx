import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const role = session.user.role;

  if (role === "ADMIN") {
    redirect("/dashboard/admin");
  } else if (role === "TUTOR") {
    redirect("/dashboard/tutor");
  } else {
    redirect("/dashboard/parent");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-black text-gray-400 uppercase tracking-widest text-xs">Mengarahkan ke Dashboard...</p>
      </div>
    </div>
  );
}
