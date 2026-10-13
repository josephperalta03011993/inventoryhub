import type { Metadata } from "next";
import { connection } from "next/server";
import { PageHeader, SummaryCard, Th, Td } from "@/components/owner/OwnerUI";
import { getEmployeeDirectory } from "@/lib/owner-data";

export const metadata: Metadata = {
  title: "Employees",
  description: "Directory of employee accounts in InventoryHub.",
};

export default async function EmployeesReportPage() {
  await connection();
  const employees = await getEmployeeDirectory();

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-900 md:px-8 md:py-10">
      <PageHeader
        title="Employee Directory"
        description="Review employee accounts and their registration dates."
      />

      <section className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <SummaryCard label="Employees" value={employees.length} />
      </section>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Account created</Th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="border-t border-slate-100 px-4 py-6 text-center text-sm text-slate-500"
                >
                  No employee accounts found.
                </td>
              </tr>
            ) : (
              employees.map((employee) => (
                <tr key={employee.id} className="border-t border-slate-100">
                  <Td className="font-medium text-slate-900">{employee.name}</Td>
                  <Td>{employee.email}</Td>
                  <Td>{employee.createdAt}</Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
