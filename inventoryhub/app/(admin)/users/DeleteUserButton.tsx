"use client";

import { deleteUser } from "./actions";

type DeleteUserButtonProps = {
  id: string;
};

export default function DeleteUserButton({
  id,
}: DeleteUserButtonProps) {
  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) {
      return;
    }

    const formData = new FormData();
    formData.append("id", id);

    await deleteUser(formData);
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
    >
      Delete
    </button>
  );
}