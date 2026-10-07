import Link from "next/link";
import { createUser } from "../actions";

export default function NewUserPage() {
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

        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          Add User
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Create a new user account.
        </p>
      </div>

      {/* Form */}
      <div className="max-w-2xl rounded-xl border bg-white p-6 shadow-sm">
        <form action={createUser} className="space-y-5">
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
              required
              className="mt-1 w-full rounded-lg border px-4 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              placeholder="Enter full name"
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
              required
              className="mt-1 w-full rounded-lg border px-4 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              placeholder="Enter email address"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              minLength={6}
              required
              className="mt-1 w-full rounded-lg border px-4 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              placeholder="Enter password"
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
              defaultValue="Employee"
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
              href="/users"
              className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}