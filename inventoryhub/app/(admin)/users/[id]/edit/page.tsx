import { sql } from "@/app/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { updateUser } from "../../actions";

export default async function EditUserPage({
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
      role
    FROM public.users
    WHERE id = ${id}
    LIMIT 1
  `;

  if (result.length === 0) {
    notFound();
  }

  const user = result[0];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <Link
          href={`/users/${id}`}
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          ← Back to User
        </Link>

        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          Edit User
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Update the user account information.
        </p>
      </div>

      {/* Form */}
      <div className="max-w-2xl rounded-xl border bg-white p-6 shadow-sm">
        <form action={updateUser} className="space-y-5">
          <input
            type="hidden"
            name="id"
            value={user.id}
          />

          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              defaultValue={user.name}
              required
              className="mt-1 w-full rounded-lg border px-4 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              defaultValue={user.email}
              required
              className="mt-1 w-full rounded-lg border px-4 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Role */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role
            </label>

            <select
              id="role"
              name="role"
              defaultValue={user.role}
              className="mt-1 w-full rounded-lg border px-4 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            >
              <option value="Employee">Employee</option>
              <option value="Admin">Admin</option>
              <option value="Owner">Owner</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t pt-5">
            <Link
              href={`/users/${id}`}
              className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}