import { Request, Response, NextFunction } from "express";

import { CustomError } from "../errors/custom-error";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    if(process.env.NODE_ENV === 'development') {
      console.log(err);
    }

    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  res.status(500).send({ errors: [{ message: "Something went wrong" }] });
};
