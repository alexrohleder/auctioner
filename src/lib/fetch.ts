import useSWR from "swr";

export const url = (uri: string, params?: Record<string, any>) => {
  const map = Object.keys(params).reduce((arr, key) => {
    if (params[key] !== undefined) {
      const value = encodeURIComponent(
        params[key] instanceof Date ? params[key].toISOString() : params[key]
      );

      return arr.concat(`${key}=${value}`);
    }

    return arr;
  }, []);

  if (map.length) {
    return `${uri}?${map.join("&")}`;
  }

  return uri;
};

export const useFetch = useSWR;
