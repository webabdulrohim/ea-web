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

    const tutors = await prisma.user.findMany({
      where: { role: "TUTOR" },
      include: { 
        tutorSkills: { include: { program: true } },
        availabilities: true
      },
    });

    return NextResponse.json(tutors);
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
