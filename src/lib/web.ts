import useSWR from "swr";

export const useFetch: typeof useSWR = (...[key, _, options]) => {
  return useSWR(
    key,
    async (url) => {
      const res = await fetch(url);

      if (!res.ok) {
        throw {
          message: "An error occurred while fetching the data.",
          info: await res.json(),
          status: res.status,
        };
      }

      return res.json();
    },
    options
  );
};

export const url = (uri: string, params: Record<string, any> = {}) => {
  const map = Object.keys(params).reduce((arr, key) => {
    if (params[key] !== undefined) {
      const value = encodeURIComponent(
        params[key] instanceof Date ? params[key].toISOString() : params[key]
      );

      return arr.concat(`${key}=${value}`);
    }

    return arr;
  }, [] as string[]);

  if (map.length) {
    return `${uri}?${map.join("&")}`;
  }

  return uri;
};

export const request = (
  method: "post" | "delete",
  url: string,
  body?: Record<string, any>
) =>
  fetch(url, {
    method,
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  })
    .then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        return { data, error: null };
      }

      const error = await res.json();
      return { data: null, error };
    })
    .catch((error) => {
      return { data: null, error };
    });

export const post = (url: string, params?: Record<string, any>) =>
  request("post", url, params);
