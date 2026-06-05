import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkBookingConflict } from "@/lib/booking";
import { notifyNewBooking } from "@/lib/whatsapp";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { studentId, tutorId, programId, date, startTime, endTime } = body;

    if (!studentId || !tutorId || !programId || !date || !startTime || !endTime) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    // Validasi konflik
    const conflictCheck = await checkBookingConflict(tutorId, studentId, start, end);
    if (conflictCheck.conflict) {
      return NextResponse.json({ error: conflictCheck.message }, { status: 422 });
    }

    const booking = await prisma.classBooking.create({
      data: {
        studentId,
        tutorId,
        programId,
        date: new Date(date),
        startTime: start,
        endTime: end,
        status: "SCHEDULED",
      },
      include: {
        student: true,
        program: true,
        tutor: true,
      },
    });

    // Kirim Notifikasi WhatsApp secara async
    notifyNewBooking({
      studentName: booking.student.name,
      programName: booking.program.name,
      date: new Date(booking.date).toLocaleDateString("id-ID"),
      time: `${start.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} - ${end.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`,
      tutorName: booking.tutor.name || "Tutor",
    }).catch((err) => console.error("WhatsApp Error:", err));

    return NextResponse.json(booking);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = session.user.role;
    const userId = session.user.id;

    let bookings;

    if (role === "ADMIN") {
      bookings = await prisma.classBooking.findMany({
        include: { student: true, tutor: true, program: true },
        orderBy: { date: 'desc' }
      });
    } else if (role === "TUTOR") {
      bookings = await prisma.classBooking.findMany({
        where: { tutorId: userId },
        include: { student: true, program: true },
        orderBy: { date: 'desc' }
      });
    } else {
      bookings = await prisma.classBooking.findMany({
        where: { student: { parentId: userId } },
        include: { student: true, tutor: true, program: true },
        orderBy: { date: 'desc' }
      });
    }

    return NextResponse.json(bookings);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
