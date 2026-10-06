"use server";

import { neon } from "@neondatabase/serverless";
import { redirect } from "next/navigation";

const sql = neon(process.env.DATABASE_URL!);

export async function deleteProduct(formData: FormData) {
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