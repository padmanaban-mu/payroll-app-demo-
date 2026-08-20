"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";

export default function AttendancePage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendance, setAttendance] = useState<{ [key: string]: { status: string, hours: number } }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const res = await fetch("/api/employees");
    const data = await res.json();
    setEmployees(data);
    
    // Initialize attendance state
    const initialAtt: any = {};
    data.forEach((emp: any) => {
      initialAtt[emp.id] = { status: "PRESENT", hours: 8 };
    });
    setAttendance(initialAtt);
  };

  const handleStatusChange = (empId: string, status: string) => {
    setAttendance(prev => ({
      ...prev,
      [empId]: { ...prev[empId], status, hours: status === "PRESENT" ? 8 : status === "HALF_DAY" ? 4 : 0 }
    }));
  };

  const handleHoursChange = (empId: string, hours: number) => {
    setAttendance(prev => ({ ...prev, [empId]: { ...prev[empId], hours } }));
  };

  const saveAttendance = async () => {
    setLoading(true);
    const payload = employees.map((emp: any) => ({
      employeeId: emp.id,
      date,
      status: attendance[emp.id].status,
      hoursWorked: attendance[emp.id].hours
    }));

    await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    setLoading(false);
    alert("Attendance saved successfully!");
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Daily Attendance</h1>
        <div className="flex items-center space-x-4">
          <input 
            type="date" 
            className="border-gray-300 rounded-md shadow-sm border p-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button
            onClick={saveAttendance}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <Check size={16} className="mr-2" /> Save All
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours Worked</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((emp: any) => (
              <tr key={emp.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{emp.firstName} {emp.lastName}</div>
                  <div className="text-xs text-gray-500">{emp.designation}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                    value={attendance[emp.id]?.status || "PRESENT"}
                    onChange={(e) => handleStatusChange(emp.id, e.target.value)}
                  >
                    <option value="PRESENT">Present</option>
                    <option value="ABSENT">Absent</option>
                    <option value="HALF_DAY">Half Day</option>
                    <option value="LEAVE">On Leave</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    min="0"
                    max="24"
                    className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    value={attendance[emp.id]?.hours ?? 8}
                    onChange={(e) => handleHoursChange(emp.id, parseFloat(e.target.value))}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
