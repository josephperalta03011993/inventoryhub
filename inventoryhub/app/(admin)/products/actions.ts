"use server";

import { neon } from "@neondatabase/serverless";
import { redirect } from "next/navigation";
import { requireRole } from "@/app/lib/session";

const sql = neon(process.env.DATABASE_URL!);

export async function deleteProduct(formData: FormData) {
  await requireRole("Admin");

  const id = Number(formData.get("id"));

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid product ID.");
  }

  await sql`
    DELETE FROM products
    WHERE id = ${id}
  `;

  redirect("/products");
}