import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "TUTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookings = await prisma.classBooking.findMany({
      where: { tutorId: session.user.id },
      include: { student: true, program: true },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "TUTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, attendanceStatus, notes } = body;

    const booking = await prisma.classBooking.update({
      where: { id },
      data: { 
        attendanceStatus, 
        notes,
        status: "COMPLETED" 
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
