"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sql } from "@/app/lib/db";
import { requireAnyRole, requireRole } from "@/app/lib/session";

export async function submitStockReport(formData: FormData) {
  const employee = await requireRole("Employee");
  const productId = Number(formData.get("productId"));
  const quantityValue = formData.get("reportedQuantity");
  const reportedQuantity =
    typeof quantityValue === "string" && quantityValue.trim() !== ""
      ? Number(quantityValue)
      : Number.NaN;
  const note = String(formData.get("note") ?? "").trim();

  if (!Number.isSafeInteger(productId) || productId <= 0 || productId > 2_147_483_647) {
    throw new Error("Select a valid product.");
  }
  if (
    !Number.isSafeInteger(reportedQuantity) ||
    reportedQuantity < 0 ||
    reportedQuantity > 2_147_483_647
  ) {
    throw new Error("Counted quantity must be a whole number of zero or more.");
  }
  if (!note || Array.from(note).length > 500) {
    throw new Error("Enter a note of up to 500 characters.");
  }

  const inserted = await sql`
    INSERT INTO public.employee_stock_reports (
      product_id,
      employee_id,
      reported_quantity,
      note
    )
    SELECT id, ${employee.id}, ${reportedQuantity}, ${note}
    FROM public.products
    WHERE id = ${productId}
    RETURNING id
  `;

  if (inserted.length === 0) {
    throw new Error("The selected product no longer exists.");
  }

  revalidatePath("/reports");
  revalidatePath("/reports/mine");
  redirect("/reports/mine");
}

export async function approveStockReport(formData: FormData) {
  const reviewer = await requireAnyRole(["Admin", "Owner"]);
  const reportId = Number(formData.get("reportId"));

  if (!Number.isSafeInteger(reportId) || reportId <= 0) {
    throw new Error("Invalid stock report.");
  }

  const result = await sql`
    WITH selected_report AS (
      SELECT id, product_id, employee_id, reported_quantity, note
      FROM public.employee_stock_reports
      WHERE id = ${reportId} AND status = 'pending'
      FOR UPDATE
    ),
    locked_product AS (
      SELECT product.id, product.stock
      FROM public.products AS product
      JOIN selected_report AS report ON report.product_id = product.id
      FOR UPDATE OF product
    ),
    updated_product AS (
      UPDATE public.products AS product
      SET
        stock = report.reported_quantity,
        status = CASE
          WHEN report.reported_quantity = 0 THEN 'Out of Stock'
          WHEN report.reported_quantity <= 10 THEN 'Low Stock'
          ELSE 'In Stock'
        END
      FROM selected_report AS report
      JOIN locked_product AS previous ON previous.id = report.product_id
      WHERE product.id = report.product_id
      RETURNING
        product.id,
        previous.stock AS previous_quantity,
        product.stock AS new_quantity
    ),
    approved_report AS (
      UPDATE public.employee_stock_reports AS report
      SET
        status = 'approved',
        reviewed_by = ${reviewer.id},
        reviewed_at = NOW()
      FROM updated_product AS product
      WHERE report.id = ${reportId}
        AND report.status = 'pending'
        AND report.product_id = product.id
      RETURNING report.id, report.employee_id, report.note
    ),
    audit_entry AS (
      INSERT INTO public.inventory_transactions (
        product_id,
        user_id,
        transaction_type,
        previous_quantity,
        new_quantity,
        quantity_change,
        reason
      )
      SELECT
        product.id,
        ${reviewer.id},
        'physical_count',
        product.previous_quantity,
        product.new_quantity,
        product.new_quantity - product.previous_quantity,
        'Approved stock report #' || report.id ||
          ' from employee ' || COALESCE(report.employee_id::text, 'unknown') ||
          ': ' || report.note
      FROM updated_product AS product
      CROSS JOIN approved_report AS report
      RETURNING id
    )
    SELECT id FROM audit_entry
  `;

  if (result.length === 0) {
    throw new Error("This report is no longer pending or its product was removed.");
  }

  revalidatePath("/products");
  revalidatePath("/owner/dashboard");
  revalidatePath("/owner/reports/stock-status");
  revalidatePath("/owner/reports/low-stock");
  revalidatePath("/owner/reports/transaction-history");
  revalidatePath("/reports");
  revalidatePath("/reports/mine");
  redirect("/reports");
}

export async function rejectStockReport(formData: FormData) {
  const reviewer = await requireAnyRole(["Admin", "Owner"]);
  const reportId = Number(formData.get("reportId"));

  if (!Number.isSafeInteger(reportId) || reportId <= 0) {
    throw new Error("Invalid stock report.");
  }

  const updated = await sql`
    UPDATE public.employee_stock_reports
    SET status = 'rejected', reviewed_by = ${reviewer.id}, reviewed_at = NOW()
    WHERE id = ${reportId} AND status = 'pending'
    RETURNING id
  `;

  if (updated.length === 0) {
    throw new Error("This report is no longer pending.");
  }

  revalidatePath("/reports");
  revalidatePath("/reports/mine");
  redirect("/reports");
}
