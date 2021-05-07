import { NextApiRequest, NextApiResponse } from "next";
import connect from "next-connect";

const api = connect<NextApiRequest, NextApiResponse>({
  onError(err, req, res) {
    if (typeof err.statusCode === "undefined" || err.statusCode >= 500) {
      console.error(err);
    }

    res.status(err.statusCode || 500).end();
  },
});

api.use((req, res, next) => {
  const _json = res.json;

  res.json = (body) => _json(JSON.stringify(body, null, 2));

  next();
});

export const abort = (statusCode: number = 500) => {
  throw { statusCode };
};

export default api;
