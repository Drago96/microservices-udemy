import { CustomError } from "./custom-error";

const DATABASE_CONNECTION_ERROR_REASON = "Error connecting to database";

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;
  reason = DATABASE_CONNECTION_ERROR_REASON;

  constructor() {
    super(DATABASE_CONNECTION_ERROR_REASON);

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
