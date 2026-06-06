import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Akses Publik & Admin
export async function GET() {
  try {
    // Galeri harus bisa dilihat oleh publik di Landing Page
    const gallery = await prisma.galleryItem.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(gallery);
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

// POST: Upload Foto Baru (Admin Only)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      console.error("Gallery POST: No session found");
      return NextResponse.json({ error: "Unauthorized: No session" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      console.error("Gallery POST: User is not ADMIN", session.user.role);
      return NextResponse.json({ error: "Unauthorized: Admin only" }, { status: 401 });
    }

    const body = await req.json();
    
    if (!body.url) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    const item = await prisma.galleryItem.create({
      data: {
        title: body.title || "EA Documentation",
        url: body.url,
        type: "IMAGE"
      },
    });

    return NextResponse.json(item);
  } catch (error: any) {
    console.error("Gallery Save Error:", error);
    return NextResponse.json({ 
      error: "Failed to save to database", 
      details: error.message 
    }, { status: 500 });
  }
}

// DELETE: Hapus Foto (Admin Only)
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID Required" }, { status: 400 });

    await prisma.galleryItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
