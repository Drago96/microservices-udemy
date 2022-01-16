import { BadRequestError } from "./bad-request-error";

export class UniqueConstraintViolationError extends BadRequestError {
  statusCode = 409;
}
