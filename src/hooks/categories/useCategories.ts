import { url, useFetch } from "../../lib/web";
import { CategoryResource } from "../../resources/CategoryResource";

const useCategories = () => {
  return useFetch<CategoryResource[]>(url("/api/v1/categories"));
};

export default useCategories;
