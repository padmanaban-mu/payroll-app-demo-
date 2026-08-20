"use client";

import { useState, useEffect } from "react";
import { Calculator, Download } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPayrolls();
  }, [month, year]);

  const fetchPayrolls = async () => {
    const res = await fetch(`/api/payroll?month=${month}&year=${year}`);
    const data = await res.json();
    setPayrolls(Array.isArray(data) ? data : []);
  };

  const generatePayroll = async () => {
    setLoading(true);
    const res = await fetch("/api/payroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ month, year })
    });
    
    if (res.ok) {
      alert("Payroll generated successfully!");
      fetchPayrolls();
    } else {
      alert("Error generating payroll.");
    }
    setLoading(false);
  };

  const downloadPayslip = (payroll: any) => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text("PAYSLIP", 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.text(`Company Name: Hackathon Corp`, 14, 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 40);
    
    doc.text(`Employee Name: ${payroll.employee.firstName} ${payroll.employee.lastName}`, 14, 50);
    doc.text(`Designation: ${payroll.employee.designation}`, 14, 60);
    doc.text(`Month/Year: ${payroll.month}/${payroll.year}`, 140, 50);

    const tableData = [
      ["Base Salary", `$${payroll.baseAmount.toFixed(2)}`],
      ["Bonuses", `$${payroll.bonuses.toFixed(2)}`],
      ["Deductions (Taxes + Absences)", `-$${payroll.deductions.toFixed(2)}`],
      ["Net Salary", `$${payroll.netSalary.toFixed(2)}`]
    ];

    (doc as any).autoTable({
      startY: 80,
      head: [["Description", "Amount"]],
      body: tableData,
      theme: "striped",
      styles: { fontSize: 12 },
      headStyles: { fillColor: [41, 128, 185] }
    });

    doc.save(`Payslip_${payroll.employee.firstName}_${payroll.month}_${payroll.year}.pdf`);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Monthly Payroll</h1>
        <div className="flex items-center space-x-4">
          <select 
            value={month} 
            onChange={(e) => setMonth(parseInt(e.target.value))}
            className="border-gray-300 rounded-md shadow-sm border p-2"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
            ))}
          </select>
          <input 
            type="number" 
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="border-gray-300 rounded-md shadow-sm border p-2 w-24"
          />
          <button
            onClick={generatePayroll}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <Calculator size={16} className="mr-2" /> Generate Payroll
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Salary</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Salary</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payrolls.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-4 text-center text-gray-500">No payroll records found for this month.</td></tr>
            ) : (
              payrolls.map((pr: any) => (
                <tr key={pr.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{pr.employee?.firstName} {pr.employee?.lastName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${pr.baseAmount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">-${pr.deductions.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">${pr.netSalary.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      {pr.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => downloadPayslip(pr)}
                      className="text-blue-600 hover:text-blue-900 flex items-center justify-end w-full"
                    >
                      <Download size={16} className="mr-1" /> PDF
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
