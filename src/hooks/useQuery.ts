import { useEffect, useState } from "react";
import supabase from "../lib/supabase";

type PostgrestError = {
  message: string;
  details: string;
  hint: string;
  code: string;
};

function useQuery<T>(
  table: string,
  withInitialLoad = true
): [T | null, PostgrestError | null, boolean] {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(withInitialLoad);

  useEffect(() => {
    if (withInitialLoad) {
      fetch();
    }
  }, [withInitialLoad]);

  async function fetch() {
    setLoading(true);

    const response = await supabase.from(table);

    setData(response.data);
    setError(response.error);
    setLoading(false);
  }

  return [data, error, loading];
}

export default useQuery;
