import React from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/auth'; 
import { sql } from '@/app/lib/db'; 

interface UserRecord {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default async function EmployeesReportPage() {
  const session = await auth();
  
  if (!session?.user || session.user.role !== 'Owner') {
    redirect('/login');
  }

  // TypeScript to interpret the query output directly as our array shape
  const employees = (await sql`
    SELECT id, name, email, role 
    FROM users 
    ORDER BY role DESC, name ASC
  `) as unknown as UserRecord[];

  return (
    <main className="min-h-screen bg-white text-black font-sans px-8 py-10">
      <div className="border-b border-gray-200 pb-5 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] font-black tracking-widest uppercase bg-black text-white px-2.5 py-1 rounded-md">
            Owner Executive System
          </span>
          <h1 className="text-2xl font-black uppercase tracking-tight text-gray-900 mt-2">
            Workforce Directory Report
          </h1>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mt-1">
            Real-time role allocations and personnel clearance configurations
          </p>
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-black uppercase tracking-widest text-gray-400">
              <th className="px-6 py-4">ID Node</th>
              <th className="px-6 py-4">Personnel Name</th>
              <th className="px-6 py-4">Business Email</th>
              <th className="px-6 py-4 text-right">System Clearance Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 font-medium text-gray-700 uppercase tracking-wide">
            {employees.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-400 font-bold">
                  No active system accounts found inside database tables.
                </td>
              </tr>
            ) : (
              employees.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-gray-400">
                    #{String(member.id).padStart(3, '0')}
                  </td>
                  <td className="px-6 py-4 font-black text-black">
                    {member.name}
                  </td>
                  <td className="px-6 py-4 font-normal text-gray-500 lowercase tracking-normal">
                    {member.email}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-block px-3 py-1 rounded-md text-[10px] font-black tracking-widest uppercase border ${
                      member.role === 'Owner' ? 'bg-black text-white border-black' :
                      member.role === 'Admin' ? 'bg-gray-100 text-black border-gray-300' :
                      'bg-white text-gray-500 border-gray-200'
                    }`}>
                      {member.role}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
