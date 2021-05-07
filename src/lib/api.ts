import joi from "joi";
import { NextApiRequest, NextApiResponse } from "next";
import connect from "next-connect";
import { getReasonPhrase } from "http-status-codes";

const api = () => {
  const handler = connect<NextApiRequest, NextApiResponse>({
    onError(err, req, res) {
      if (typeof err.httpCode === "undefined" || err.httpCode >= 500) {
        console.error(err);
      }

      const code = err.httpCode || 500;

      res.status(code).json({
        code,
        reason: getReasonPhrase(code),
        details: err.details,
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

export const abort = (httpCode: number = 500, details?: any) => {
  throw { httpCode, details };
};

export default api;
