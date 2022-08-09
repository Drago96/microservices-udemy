import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { currentUser, errorHandler, NotFoundError } from "@drptickets/common";

import { createOrderRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { indexOrdersRouter } from "./routes/index";
import { deleteOrderRouter } from "./routes/delete";

export const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUser);

app.use(createOrderRouter);
app.use(showTicketRouter);
app.use(indexOrdersRouter);
app.use(deleteOrderRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);
