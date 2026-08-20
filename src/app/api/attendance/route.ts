import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get("date");

    const query = dateStr 
      ? { date: new Date(dateStr) }
      : {};

    const attendance = await prisma.attendance.findMany({
      where: query,
      include: { employee: true }
    });
    return NextResponse.json(attendance);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch attendance" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json(); // Array of attendance records
    
    // Batch upsert isn't directly supported in sqlite for this complex case, so let's do a transaction
    const operations = data.map((record: any) => {
      return prisma.attendance.create({
        data: {
          employeeId: record.employeeId,
          date: new Date(record.date),
          status: record.status,
          hoursWorked: parseFloat(record.hoursWorked || 0)
        }
      });
    });

    await prisma.$transaction(operations);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to mark attendance" }, { status: 500 });
  }
}
