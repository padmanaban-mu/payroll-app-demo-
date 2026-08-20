import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    const query: any = {};
    if (month) query.month = parseInt(month);
    if (year) query.year = parseInt(year);

    const payrolls = await prisma.payroll.findMany({
      where: query,
      include: { employee: true }
    });
    return NextResponse.json(payrolls);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch payrolls" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { month, year } = await req.json();
    
    // Fetch all employees
    const employees = await prisma.employee.findMany();

    const payrollRecords = [];

    for (const emp of employees) {
      // Fetch attendance for this month
      // Start and end date of the month
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      const attendances = await prisma.attendance.findMany({
        where: {
          employeeId: emp.id,
          date: { gte: startDate, lte: endDate }
        }
      });

      // Calculate deductions based on absences
      let absentDays = 0;
      attendances.forEach(att => {
        if (att.status === "ABSENT") absentDays += 1;
        if (att.status === "HALF_DAY") absentDays += 0.5;
      });

      // Daily wage calculation (assuming 30 days in a month for simplicity)
      const dailyWage = emp.baseSalary / 30;
      const absentDeduction = absentDays * dailyWage;

      // Fixed 10% tax deduction on base salary
      const taxDeduction = emp.baseSalary * 0.10;

      const totalDeductions = absentDeduction + taxDeduction;
      const netSalary = emp.baseSalary - totalDeductions;

      // Save to payroll
      const payroll = await prisma.payroll.create({
        data: {
          employeeId: emp.id,
          month: parseInt(month),
          year: parseInt(year),
          baseAmount: emp.baseSalary,
          bonuses: 0,
          deductions: totalDeductions,
          netSalary: netSalary,
          status: "PENDING"
        },
        include: { employee: true }
      });
      payrollRecords.push(payroll);
    }

    return NextResponse.json(payrollRecords);
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate payroll" }, { status: 500 });
  }
}
