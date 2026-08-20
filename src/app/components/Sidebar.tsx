"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Users, Calendar, DollarSign, LayoutDashboard, LogOut } from "lucide-react";

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (!session || pathname === "/login") return null;

  const role = (session.user as any)?.role;

  const adminLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { href: "/admin/employees", label: "Employees", icon: <Users size={20} /> },
    { href: "/admin/attendance", label: "Attendance", icon: <Calendar size={20} /> },
    { href: "/admin/payroll", label: "Payroll", icon: <DollarSign size={20} /> },
  ];

  const employeeLinks = [
    { href: "/employee/dashboard", label: "My Dashboard", icon: <LayoutDashboard size={20} /> },
  ];

  const links = role === "ADMIN" ? adminLinks : employeeLinks;

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Payroll System</h1>
      </div>
      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          {links.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center px-6 py-3 text-sm font-medium ${
                    isActive
                      ? "text-blue-600 bg-blue-50 border-r-4 border-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span className="mr-3">{link.icon}</span>
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
            {session.user?.email?.[0].toUpperCase()}
          </div>
          <div className="text-sm overflow-hidden text-ellipsis w-32 whitespace-nowrap">
            <p className="font-medium text-gray-900">{session.user?.email}</p>
            <p className="text-gray-500 capitalize">{role}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <LogOut size={16} className="mr-2" />
          Sign out
        </button>
      </div>
    </div>
  );
}
