import { getReasonPhrase } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";
import connect from "next-connect";
import { HttpError } from "./errors";

const api = () => {
  const handler = connect<NextApiRequest, NextApiResponse>({
    onError(err, req, res) {
      if (err instanceof HttpError) {
        return res.status(err.statusCode).json({
          status: err.statusCode,
          message: err.message,
          details: err.details,
        });
      }

      res.status(500).json({
        status: 500,
        message: getReasonPhrase(500),
        err: err.toString(),
      });
    },
  });

  handler.use((req, res, next) => {
    const _json = res.json;

    res.json = (body) => _json(JSON.stringify(body, null, 2));

    next();
  });

  return handler;
};

export default api;
