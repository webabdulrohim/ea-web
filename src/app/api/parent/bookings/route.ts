import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "STUDENT_PARENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { tutorId, studentId, programId, date, startTime, endTime } = body;

    const booking = await prisma.classBooking.create({
      data: {
        tutorId,
        studentId,
        programId,
        date: new Date(date),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status: "SCHEDULED"
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "STUDENT_PARENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookings = await prisma.classBooking.findMany({
      where: { student: { parentId: session.user.id } },
      include: { tutor: true, program: true, student: true },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
