import useSWR from "swr";

function getQueryString(params = {}) {
  const map = Object.keys(params).reduce((arr, key) => {
    if (params[key] !== undefined) {
      const value = encodeURIComponent(
        params[key] instanceof Date ? params[key].getTime() : params[key]
      );

      return arr.concat(`${key}=${value}`);
    }

    return arr;
  }, []);

  if (map.length) {
    return `?${map.join("&")}`;
  }

  return "";
}

function useFetch(url: string, params?: Record<string, any>) {
  let newUrl = url + getQueryString(params);

  return useSWR(newUrl);
}

export default useFetch;
