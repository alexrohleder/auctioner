import { useState } from "react";
import { request } from "../../lib/web";

const useDeleteAttribute = () => {
  const [isDeleting, setDeleting] = useState(false);

  async function deleteAttribute(attributeId: string) {
    setDeleting(true);

    const response = await request(
      "delete",
      `/api/v1/attributes/${attributeId}`
    );

    setDeleting(false);

    return response;
  }

  return [deleteAttribute, isDeleting] as const;
};

export default useDeleteAttribute;
