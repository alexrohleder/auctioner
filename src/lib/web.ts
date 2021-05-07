const apiRequest = (method: "post", url: string, body?: Record<string, any>) =>
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
  apiRequest("post", url, params);
