"use client";

import { deleteProduct } from "./actions";

type DeleteProductButtonProps = {
  id: number;
};

export default function DeleteProductButton({
  id,
}: DeleteProductButtonProps) {
  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    const formData = new FormData();
    formData.append("id", String(id));

    await deleteProduct(formData);
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
    >
      Delete
    </button>
  );
}