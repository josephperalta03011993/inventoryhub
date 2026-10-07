"use server";

import { sql } from "@/app/lib/db";
import { redirect } from "next/navigation";
import { hashPassword } from "@/app/lib/auth-utils";

export async function createUser(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const role = String(formData.get("role") || "Employee");

  if (!name || !email || !password) {
    throw new Error("Name, email, and password are required.");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long.");
  }

  if (!["Employee", "Admin", "Owner"].includes(role)) {
    throw new Error("Invalid user role.");
  }

  const existingUsers = await sql`
    SELECT id
    FROM public.users
    WHERE email = ${email}
    LIMIT 1
  `;

  if (existingUsers.length > 0) {
    throw new Error("A user with this email already exists.");
  }

  const hashedPassword = await hashPassword(password);

  await sql`
    INSERT INTO public.users (
      name,
      email,
      password,
      role
    )
    VALUES (
      ${name},
      ${email},
      ${hashedPassword},
      ${role}
    )
  `;

  redirect("/users");
}

export async function updateUser(formData: FormData) {
  const id = String(formData.get("id"));
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const role = String(formData.get("role") || "Employee");

  if (!id) {
    throw new Error("Invalid user ID.");
  }

  if (!name || !email) {
    throw new Error("Name and email are required.");
  }

  if (!["Employee", "Admin", "Owner"].includes(role)) {
    throw new Error("Invalid user role.");
  }

  await sql`
    UPDATE public.users
    SET
      name = ${name},
      email = ${email},
      role = ${role},
      updated_at = NOW()
    WHERE id = ${id}
  `;

  redirect(`/users/${id}`);
}

export async function deleteUser(formData: FormData) {
  const id = String(formData.get("id"));

  if (!id) {
    throw new Error("Invalid user ID.");
  }

  await sql`
    DELETE FROM public.users
    WHERE id = ${id}
  `;

  redirect("/users");
}