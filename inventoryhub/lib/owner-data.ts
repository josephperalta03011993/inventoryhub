// Server-side data access for the owner section (/owner/...), backed by the Neon
// database. Only import the types from client components — the functions
// pull in the db connection and must run on the server.
//
// Queries throw on failure so app/owner/error.tsx can show a "couldn't load"
// message instead of an empty report that looks like real data.
import { sql } from "@/app/lib/db";

// The products table has no per-product restock level yet, so every product
// uses this threshold. A product is low at or below it, matching the
// "Low Stock" badge on /products (stock > 10 is shown as healthy).
export const LOW_STOCK_THRESHOLD = 10;

// Dates are shown and filtered by the store's calendar day, not the server's
// or the browser's, so every viewer sees the same thing.
export const STORE_TIME_ZONE = "Asia/Manila";

// Transaction history shows this many days when no date range is chosen.
export const DEFAULT_HISTORY_DAYS = 30;

export type Product = {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  restockLevel: number;
  isLowStock: boolean;
};

export type TransactionType = "stock_adjustment" | "restock" | "physical_count";

export type Transaction = {
  id: number;
  productName: string;
  sku: string;
  transactionType: TransactionType;
  previousQuantity: number;
  newQuantity: number;
  quantityChange: number;
  reason: string;
  employeeName: string;
  timestamp: string; // ISO 8601
  displayTime: string; // Formatted on the server to avoid hydration mismatches
};

export type TransactionFilters = {
  startDate: string; // "YYYY-MM-DD" in the store's time zone
  endDate: string; // "YYYY-MM-DD" in the store's time zone
  employeeId: string; // "" for all employees
};

export type Employee = {
  id: string;
  name: string;
};

export class TransactionHistoryNotConfiguredError extends Error {
  constructor() {
    super("The inventory_transactions table has not been created.");
    this.name = "TransactionHistoryNotConfiguredError";
  }
}

const displayTimeFormat = new Intl.DateTimeFormat("en-PH", {
  timeZone: STORE_TIME_ZONE,
  dateStyle: "medium",
  timeStyle: "short",
});

// "en-CA" formats dates as YYYY-MM-DD, which matches <input type="date">.
const isoDateFormat = new Intl.DateTimeFormat("en-CA", { timeZone: STORE_TIME_ZONE });

function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function getDefaultTransactionDateRange(): { startDate: string; endDate: string } {
  const today = isoDateFormat.format(new Date());
  return { startDate: addDays(today, -(DEFAULT_HISTORY_DAYS - 1)), endDate: today };
}

export async function getProducts(): Promise<Product[]> {
  const rows = await sql`
    SELECT id, name, sku, stock, price
    FROM products
    ORDER BY name ASC
  `;

  return rows.map((row) => {
    const quantity = Number(row.stock);
    return {
      id: Number(row.id),
      name: row.name,
      sku: row.sku,
      quantity,
      price: Number(row.price),
      restockLevel: LOW_STOCK_THRESHOLD,
      isLowStock: quantity <= LOW_STOCK_THRESHOLD,
    };
  });
}

export function getLowStockProducts(products: Product[]): Product[] {
  return products.filter((p) => p.isLowStock);
}

export function getTotalStockValue(products: Product[]): number {
  return products.reduce((sum, p) => sum + p.quantity * p.price, 0);
}

export async function getEmployees(): Promise<Employee[]> {
  const rows = await sql`
    SELECT id, name
    FROM users
    ORDER BY name ASC
  `;

  return rows.map((row) => ({ id: String(row.id), name: row.name }));
}

export async function getTransactions(filters: TransactionFilters): Promise<Transaction[]> {
  const employeeId = filters.employeeId || null;

  let rows;
  try {
    rows = await sql`
      SELECT
        t.id,
        p.name AS product_name,
        p.sku,
        t.transaction_type,
        t.previous_quantity,
        t.new_quantity,
        t.quantity_change,
        t.reason,
        u.name AS employee_name,
        t.created_at
      FROM inventory_transactions t
      LEFT JOIN products p ON p.id = t.product_id
      LEFT JOIN users u ON u.id = t.user_id
      WHERE (t.created_at AT TIME ZONE ${STORE_TIME_ZONE}::text)::date
              BETWEEN ${filters.startDate}::date AND ${filters.endDate}::date
        AND (${employeeId}::text IS NULL OR t.user_id::text = ${employeeId}::text)
      ORDER BY t.created_at DESC
    `;
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "42P01" &&
      "message" in error &&
      typeof error.message === "string" &&
      error.message.includes('"inventory_transactions"')
    ) {
      throw new TransactionHistoryNotConfiguredError();
    }
    throw error;
  }

  return rows.map((row) => {
    const createdAt = new Date(row.created_at);
    return {
      id: Number(row.id),
      productName: row.product_name ?? "Deleted product",
      sku: row.sku ?? "—",
      transactionType: row.transaction_type,
      previousQuantity: Number(row.previous_quantity),
      newQuantity: Number(row.new_quantity),
      quantityChange: Number(row.quantity_change),
      reason: row.reason ?? "",
      employeeName: row.employee_name ?? "Unknown",
      timestamp: createdAt.toISOString(),
      displayTime: displayTimeFormat.format(createdAt),
    };
  });
}
