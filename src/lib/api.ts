import { NextApiRequest, NextApiResponse } from "next";
import connect from "next-connect";

const api = connect<NextApiRequest, NextApiResponse>();

api.use((req, res, next) => {
  const _json = res.json;

  res.json = (body) => _json(JSON.stringify(body, null, 2));

  next();
});

export default api;
