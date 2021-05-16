import { useFetch } from "../../lib/web";
import { AttributeResource } from "../../resources/AttributeResource";

const useAttribute = (attributeId?: string) => {
  return useFetch<AttributeResource>(
    attributeId ? `/api/v1/attributes/${attributeId}` : null
  );
};

export default useAttribute;
