"use client";

import { useEffect, useState } from "react";
import { Users, DollarSign, Clock } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalEmployees: 0, totalPayroll: 0 });

  useEffect(() => {
    async function fetchData() {
      const empRes = await fetch("/api/employees");
      const emps = await empRes.json();
      
      const prRes = await fetch(`/api/payroll?month=${new Date().getMonth()+1}&year=${new Date().getFullYear()}`);
      const prs = await prRes.json();
      
      const totalPayroll = Array.isArray(prs) ? prs.reduce((acc: number, curr: any) => acc + curr.netSalary, 0) : 0;

      setStats({
        totalEmployees: emps.length,
        totalPayroll
      });
    }
    fetchData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Employees</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalEmployees}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Payroll This Month</p>
            <p className="text-2xl font-bold text-gray-900">${stats.totalPayroll.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Pending Approvals</p>
            <p className="text-2xl font-bold text-gray-900">0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
