import { sql } from "@/app/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";

type User = {
  id: string;
  name: string;
  email: string;
  role: "Employee" | "Admin" | "Owner";
  created_at: string;
  updated_at: string;
};

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const result = await sql`
    SELECT
      id,
      name,
      email,
      role,
      created_at,
      updated_at
    FROM public.users
    WHERE id = ${id}
    LIMIT 1
  `;

  if (result.length === 0) {
    notFound();
  }

  const user = result[0] as unknown as User;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <Link
          href="/users"
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          ← Back to Users
        </Link>

        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {user.name}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              User details and account information.
            </p>
          </div>

          <Link
            href={`/users/${user.id}/edit`}
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Edit User
          </Link>
        </div>
      </div>

      {/* User Information */}
      <div className="max-w-3xl overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b px-6 py-4">
          <h2 className="font-semibold text-gray-900">
            User Information
          </h2>
        </div>

        <div className="divide-y">
          <div className="grid gap-2 px-6 py-4 md:grid-cols-3">
            <p className="text-sm font-medium text-gray-500">
              Name
            </p>

            <p className="text-sm text-gray-900 md:col-span-2">
              {user.name}
            </p>
          </div>

          <div className="grid gap-2 px-6 py-4 md:grid-cols-3">
            <p className="text-sm font-medium text-gray-500">
              Email
            </p>

            <p className="text-sm text-gray-900 md:col-span-2">
              {user.email}
            </p>
          </div>

          <div className="grid gap-2 px-6 py-4 md:grid-cols-3">
            <p className="text-sm font-medium text-gray-500">
              Role
            </p>

            <p className="text-sm text-gray-900 md:col-span-2">
              {user.role}
            </p>
          </div>

          <div className="grid gap-2 px-6 py-4 md:grid-cols-3">
            <p className="text-sm font-medium text-gray-500">
              Created
            </p>

            <p className="text-sm text-gray-900 md:col-span-2">
              {new Date(user.created_at).toLocaleString()}
            </p>
          </div>

          <div className="grid gap-2 px-6 py-4 md:grid-cols-3">
            <p className="text-sm font-medium text-gray-500">
              Last Updated
            </p>

            <p className="text-sm text-gray-900 md:col-span-2">
              {new Date(user.updated_at).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}