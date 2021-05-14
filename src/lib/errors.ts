import { getReasonPhrase } from "http-status-codes";

export class HttpError extends Error {
  constructor(public statusCode: number, public reason?: string) {
    super(getReasonPhrase(statusCode));
  }
}

export class BadRequestError extends HttpError {
  constructor(reason: string) {
    super(400, reason);
  }
}
