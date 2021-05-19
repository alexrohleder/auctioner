import { useFetch } from "../../lib/web";

const useAttribute = (attributeId?: string) => {
  return useFetch<any>(
    attributeId ? `/api/v1/attributes/${attributeId}` : null
  );
};

export default useAttribute;
