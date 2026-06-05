import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "STUDENT_PARENT")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role === "STUDENT_PARENT") {
      const invoices = await prisma.invoice.findMany({
        where: { parentId: session.user.id },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(invoices);
    }

    const invoices = await prisma.invoice.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(invoices);
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const invoice = await prisma.invoice.create({
      data: {
        parentId: body.parentId,
        amount: Number(body.amount),
        dueDate: new Date(body.dueDate),
        description: body.description,
        items: JSON.stringify(body.items || []),
      },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, status, proofImage } = body;

    const invoice = await prisma.invoice.update({
      where: { id },
      data: { 
        status: status || "PENDING",
        proofImage: proofImage || undefined
      },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
