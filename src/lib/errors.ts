import { getReasonPhrase } from "http-status-codes";

export class HttpError extends Error {
  constructor(public statusCode: number, public errors?: any) {
    super(getReasonPhrase(statusCode));
  }
}

export class BadRequestError extends HttpError {
  constructor(errors: string) {
    super(400, errors);
  }
}
