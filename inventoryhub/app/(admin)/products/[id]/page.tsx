import { neon } from "@neondatabase/serverless";
import Link from "next/link";
import { notFound } from "next/navigation";

const sql = neon(process.env.DATABASE_URL!);

type Product = {
  id: number;
  sku: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  status: string;
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;
  const productId = Number(id);

  if (!Number.isInteger(productId)) {
    notFound();
  }

  const result = await sql`
    SELECT
      id,
      sku,
      name,
      category,
      stock,
      price,
      status
    FROM products
    WHERE id = ${productId}
    LIMIT 1
  `;

  if (result.length === 0) {
    notFound();
  }

  const product = result[0] as Product;

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <Link
          href="/products"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          ← Back to Products
        </Link>

        <h1 className="mt-3 text-3xl font-bold text-gray-900">
          Product Details
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View the details of this inventory product.
        </p>
      </div>

      <div className="rounded-xl border bg-white shadow-sm">
        <div className="grid grid-cols-1 divide-y md:grid-cols-2 md:divide-x md:divide-y-0">
          <div className="space-y-6 p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">
                SKU
              </p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {product.sku}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Product Name
              </p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {product.name}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Category
              </p>
              <p className="mt-1 text-gray-900">
                {product.category}
              </p>
            </div>
          </div>

          <div className="space-y-6 p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Stock
              </p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {product.stock}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Price
              </p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                ₱{Number(product.price).toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Status
              </p>
              <p className="mt-1 text-gray-900">
                {product.status}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t bg-gray-50 p-6">
          <Link
            href="/products"
            className="rounded-md border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back
          </Link>

          <Link
            href={`/products/${product.id}/edit`}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Edit Product
          </Link>
        </div>
      </div>
    </div>
  );
}