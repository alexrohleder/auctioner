import { getReasonPhrase } from "http-status-codes";
import Joi from "joi";

export class HttpError extends Error {
  constructor(public statusCode: number, public details?: any) {
    super(getReasonPhrase(statusCode));
  }
}

export class BadRequestError extends HttpError {
  constructor(joiError: Joi.ValidationError) {
    super(
      400,
      joiError.details.map((detail) => detail.message.replace(/"/g, "'"))
    );
  }
}
