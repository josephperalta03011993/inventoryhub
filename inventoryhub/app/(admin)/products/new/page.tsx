import { neon } from "@neondatabase/serverless";
import Link from "next/link";
import { redirect } from "next/navigation";

const sql = neon(process.env.DATABASE_URL!);

export default function NewProductPage() {
  async function createProduct(formData: FormData) {
    "use server";

    const sku = String(formData.get("sku") || "").trim();
    const name = String(formData.get("name") || "").trim();
    const category = String(formData.get("category") || "").trim();
    const stock = Number(formData.get("stock") || 0);
    const price = Number(formData.get("price") || 0);
    const status = String(formData.get("status") || "In Stock");

    if (!sku || !name || !category) {
      throw new Error("SKU, product name, and category are required.");
    }

    if (stock < 0 || price < 0) {
      throw new Error("Stock and price cannot be negative.");
    }

    await sql`
      INSERT INTO products (
        sku,
        name,
        category,
        stock,
        price,
        status
      )
      VALUES (
        ${sku},
        ${name},
        ${category},
        ${stock},
        ${price},
        ${status}
      )
    `;

    redirect("/products");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      {/* Header */}
      <div>
        <div className="mb-2">
          <Link
            href="/products"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            ← Back to Products
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900">
          Add Product
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Create a new product and SKU for your inventory.
        </p>
      </div>

      {/* Form */}
      <form
        action={createProduct}
        className="space-y-6 rounded-xl border bg-white p-6 shadow-sm"
      >
        {/* SKU */}
        <div>
          <label
            htmlFor="sku"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            SKU
          </label>

          <input
            id="sku"
            name="sku"
            type="text"
            required
            placeholder="e.g. WM-002"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          <p className="mt-1 text-xs text-gray-500">
            Enter a unique stock keeping unit.
          </p>
        </div>

        {/* Product Name */}
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Product Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="e.g. Wireless Mouse"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Category
          </label>

          <input
            id="category"
            name="category"
            type="text"
            required
            placeholder="e.g. Computer Accessories"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Stock and Price */}
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="stock"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Stock
            </label>

            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              required
              defaultValue="0"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label
              htmlFor="price"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Price
            </label>

            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
              placeholder="0.00"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label
            htmlFor="status"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Status
          </label>

          <select
            id="status"
            name="status"
            defaultValue="In Stock"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 border-t pt-6">
          <Link
            href="/products"
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            Create Product
          </button>
        </div>
      </form>
    </div>
  );
}