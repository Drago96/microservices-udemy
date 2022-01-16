import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";

import { RequestValidationError } from "../errors/request-validation-error";
import { UniqueConstraintViolationError } from "../errors/unique-constraint-violation-error";
import { User } from "../models/user";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid!"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters!"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { email } = req.body;

    const userExists = await User.exists({ email });

    if (userExists) {
      throw new UniqueConstraintViolationError("Email in use");
    }

    const user = User.build({ email, password: "asd" });

    await user.save();

    res.send(user);
  }
);

export { router as signupRouter };
