"use client";

import { useEffect, useState } from "react";
import { Download, User as UserIcon } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function EmployeeDashboard() {
  const [employee, setEmployee] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const res = await fetch("/api/employee/me");
    if (res.ok) {
      const data = await res.json();
      setEmployee(data);
    }
  };

  const downloadPayslip = (payroll: any) => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text("PAYSLIP", 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.text(`Company Name: Hackathon Corp`, 14, 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 40);
    
    doc.text(`Employee Name: ${employee.firstName} ${employee.lastName}`, 14, 50);
    doc.text(`Designation: ${employee.designation}`, 14, 60);
    doc.text(`Month/Year: ${payroll.month}/${payroll.year}`, 140, 50);

    const tableData = [
      ["Base Salary", `$${payroll.baseAmount.toFixed(2)}`],
      ["Bonuses", `$${payroll.bonuses.toFixed(2)}`],
      ["Deductions", `-$${payroll.deductions.toFixed(2)}`],
      ["Net Salary", `$${payroll.netSalary.toFixed(2)}`]
    ];

    (doc as any).autoTable({
      startY: 80,
      head: [["Description", "Amount"]],
      body: tableData,
      theme: "striped"
    });

    doc.save(`Payslip_${employee.firstName}_${payroll.month}_${payroll.year}.pdf`);
  };

  if (!employee) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Dashboard</h1>

      <div className="bg-white rounded-lg shadow mb-8 p-6 flex items-center">
        <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-6">
          <UserIcon size={32} />
        </div>
        <div>
          <h2 className="text-xl font-bold">{employee.firstName} {employee.lastName}</h2>
          <p className="text-gray-500">{employee.designation} | {employee.department}</p>
          <p className="text-sm text-gray-400 mt-1">Joined: {new Date(employee.joinDate).toLocaleDateString()}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-4">My Payslips</h2>
      <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month/Year</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Salary</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employee.payrolls?.map((pr: any) => (
              <tr key={pr.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pr.month}/{pr.year}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">${pr.netSalary.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button onClick={() => downloadPayslip(pr)} className="text-blue-600 hover:text-blue-900 flex justify-end items-center w-full">
                    <Download size={16} className="mr-1"/> Download PDF
                  </button>
                </td>
              </tr>
            ))}
            {(!employee.payrolls || employee.payrolls.length === 0) && (
              <tr><td colSpan={3} className="px-6 py-4 text-center text-gray-500">No payslips available.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Attendance</h2>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employee.attendances?.map((att: any) => (
              <tr key={att.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(att.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${att.status === 'PRESENT' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {att.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{att.hoursWorked}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
