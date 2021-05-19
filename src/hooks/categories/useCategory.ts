import { useFetch } from "../../lib/web";

const useCategory = (categoryId?: string) => {
  return useFetch<any>(categoryId ? `/api/v1/categories/${categoryId}` : null);
};

export default useCategory;
