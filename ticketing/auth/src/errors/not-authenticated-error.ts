import { CustomError } from "./custom-error";

const NOT_AUTHENTICATED_ERROR_MESSAGE = "Not authenticated";

export class NotAuthenticatedError extends CustomError {
  statusCode = 401;

  constructor() {
    super(NOT_AUTHENTICATED_ERROR_MESSAGE);

    Object.setPrototypeOf(this, NotAuthenticatedError.prototype);
  }

  serializeErrors() {
    return [{ message: NOT_AUTHENTICATED_ERROR_MESSAGE }];
  }
}
