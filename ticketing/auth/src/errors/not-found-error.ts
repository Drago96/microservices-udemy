import { CustomError } from "./custom-error";

const NOT_FOUND_ERROR_REASON = "Not found";

export class NotFoundError extends CustomError {
  statusCode = 404;
  reason = NOT_FOUND_ERROR_REASON;

  constructor() {
    super(NOT_FOUND_ERROR_REASON);

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
