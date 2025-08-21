import { errorMessages } from "../constants";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly message: string;
  constructor({
    statusCode = errorMessages.INTERNAL_SERVER_ERROR.statusCode,
    message = errorMessages.INTERNAL_SERVER_ERROR.message,
  }: {
    statusCode?: number;
    message: string;
  }) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;

    // Required for extending built-in classes
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}
