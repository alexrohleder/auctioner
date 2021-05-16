import { useState } from "react";
import { request } from "../../lib/web";

const useDeleteCategory = () => {
  const [isDeleting, setDeleting] = useState(false);

  async function deleteCategory(categoryId: string) {
    setDeleting(true);

    const response = await request(
      "delete",
      `/api/v1/categories/${categoryId}`
    );

    setDeleting(false);

    return response;
  }

  return [deleteCategory, isDeleting] as const;
};

export default useDeleteCategory;
