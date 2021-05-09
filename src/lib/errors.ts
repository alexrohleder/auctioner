import { getReasonPhrase } from "http-status-codes";
import Joi from "joi";

export class HttpError extends Error {
  constructor(public statusCode: number, public details?: any) {
    super(getReasonPhrase(statusCode));
  }
}

export class BadRequestError extends HttpError {
  constructor(error: string | Joi.ValidationError) {
    super(
      400,
      typeof error === "string"
        ? [error]
        : error.details.map((detail) => detail.message.replace(/"/g, "'"))
    );
  }
}
