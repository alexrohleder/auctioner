import useSWR from "swr";

export const useFetch = useSWR;

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

const request = (method: "post", url: string, body?: Record<string, any>) =>
  fetch(url, {
    method,
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  }).then((res) => {
    if (res.ok) {
      return res.json().then((data) => ({ data, error: null }));
    }

    return res.text().then((error) => ({ data: null, error }));
  });

export const post = (url: string, params: Record<string, any>) =>
  request("post", url, params);
