import { url, useFetch } from "../../lib/web";

const useAttributes = () => {
  return useFetch<any[]>(url("/api/v1/attributes"));
};

export default useAttributes;
