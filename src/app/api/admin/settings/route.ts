import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET: Akses Publik (untuk Landing Page)
export async function GET() {
  try {
    const settings = await prisma.landingContent.findUnique({
      where: { id: "singleton" },
    });

    if (!settings) {
      return NextResponse.json({
        heroTitle: "EA - English Action | Be Brave to Act",
        heroDesc: "Bimbingan Belajar Multidisiplin Cirebon",
        ownerName: "Ms. Owner",
        ownerMsg: "Selamat datang di EA",
        logoUrl: "/logo.png"
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

// POST: Update Settings (Admin Only)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      console.error("Settings POST: No session found");
      return NextResponse.json({ error: "Unauthorized: No session" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      console.error("Settings POST: User is not ADMIN", session.user.role);
      return NextResponse.json({ error: "Unauthorized: Admin only" }, { status: 401 });
    }

    const body = await req.json();
    
    // Sanitize data: only allow valid fields for update/create
    const data = {
      logoUrl: body.logoUrl,
      heroTitle: body.heroTitle,
      heroDesc: body.heroDesc,
      heroImageUrl: body.heroImageUrl,
      ownerName: body.ownerName,
      ownerMsg: body.ownerMsg,
      ownerImageUrl: body.ownerImageUrl,
      videoUrl: body.videoUrl,
    };
    
    console.log("Upserting Settings with sanitized data:", data);

    const settings = await prisma.landingContent.upsert({
      where: { id: "singleton" },
      update: data,
      create: { id: "singleton", ...data },
    });

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error("LP Settings Save Error:", error);
    return NextResponse.json({ 
      error: "Failed to save settings", 
      details: error.message 
    }, { status: 500 });
  }
}
