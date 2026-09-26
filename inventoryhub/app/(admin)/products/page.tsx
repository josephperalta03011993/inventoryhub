import { neon } from "@neondatabase/serverless";
import Link from "next/link";
import { deleteProduct } from "./actions";
import DeleteProductButton from "./DeleteProductButton";

const sql = neon(process.env.DATABASE_URL!);

type Product = {
  id: number;
  name: string;
  category: string;
  stock: number;
  price: number;
  status: string;
};

export default async function ProductsPage() {
  let products: Product[] = [];

  try {
    const result = await sql`
      SELECT
        id,
        name,
        category,
        stock,
        price,
        status
      FROM products
      ORDER BY id DESC
    `;

    products = result.map((product: any) => ({
      id: Number(product.id),
      name: product.name,
      category: product.category,
      stock: Number(product.stock),
      price: Number(product.price),
      status: product.status,
    }));
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (sum, product) => sum + product.stock,
    0
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Products
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your inventory products.
          </p>
        </div>

        <Link
          href="/products/new"
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Products
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {totalProducts}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Stock
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {totalStock}
          </h2>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b px-6 py-4">
          <h2 className="font-semibold text-gray-900">
            Product List
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Product
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Category
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Stock
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Price
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Status
                </th>

                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {product.name}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {product.category}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {product.stock}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      ₱{product.price.toFixed(2)}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          product.stock > 10
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/products/${product.id}`}
                          className="rounded-md border px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          View
                        </Link>

                        <Link
                          href={`/products/${product.id}/edit`}
                          className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                          Edit
                        </Link>

                        <DeleteProductButton id={product.id} />
                      
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}