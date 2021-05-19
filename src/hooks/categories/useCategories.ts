import { url, useFetch } from "../../lib/web";

const useCategories = () => {
  return useFetch<any[]>(url("/api/v1/categories"));
};

export default useCategories;
