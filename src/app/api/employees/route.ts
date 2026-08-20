import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      include: { user: true }
    });
    return NextResponse.json(employees);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Create User first, then Employee
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: "password", // Dummy password
        role: "EMPLOYEE",
        Employee: {
          create: {
            firstName: data.firstName,
            lastName: data.lastName,
            department: data.department,
            designation: data.designation,
            baseSalary: parseFloat(data.baseSalary),
            joinDate: new Date(data.joinDate),
            bankAccount: data.bankAccount,
          }
        }
      },
      include: { Employee: true }
    });

    return NextResponse.json(user.Employee);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create employee" }, { status: 500 });
  }
}
