import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "STUDENT_PARENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reports = await prisma.classBooking.findMany({
      where: { 
        student: { parentId: session.user.id },
        status: "COMPLETED",
        report: { not: null }
      },
      include: { student: true, program: true, tutor: true },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(reports);
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
