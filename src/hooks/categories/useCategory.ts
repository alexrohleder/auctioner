import { useFetch } from "../../lib/web";
import { CategoryResource } from "../../resources/CategoryResource";

const useCategory = (categoryId?: string) => {
  return useFetch<CategoryResource>(
    categoryId ? `/api/v1/categories/${categoryId}` : null
  );
};

export default useCategory;
