import { getReasonPhrase } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";
import connect from "next-connect";
import { ZodError } from "zod";
import { cast } from "./casts";
import { HttpError } from "./errors";

const api = () => {
  const handler = connect<NextApiRequest, NextApiResponse>({
    onError(err, req, res) {
      let status = 500;
      let errors = err.toString();

      if (err instanceof ZodError) {
        const format = (e) => ({ path: e.path.join("."), message: e.message });
        status = 400;
        errors = err.errors.map(format);
      } else if (err instanceof HttpError) {
        status = err.statusCode;
        errors = [err.reason];
      }

      res.status(status).json({
        status,
        message: getReasonPhrase(status),
        errors,
      });
    },
  });

  handler.use((req, res, next) => {
    const _json = res.json;

    res.json = (body) => _json(JSON.stringify(body, null, 2));

    next();
  });

  handler.use((req, res, next) => {
    const input = ["query", "body"];

    for (const channel of input) {
      for (const key in req[channel]) {
        const val = req[channel][key];
        const casted = Array.isArray(val) ? val.map(cast) : cast(val);
        req[channel][key] = casted as string | string[];
      }
    }

    next();
  });

  return handler;
};

export default api;
