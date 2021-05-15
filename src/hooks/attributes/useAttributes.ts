import { url, useFetch } from "../../lib/web";
import { AttributeResource } from "../../resources/AttributeResource";

const useAttributes = () => {
  return useFetch<AttributeResource[]>(url("/api/v1/attributes"));
};

export default useAttributes;
