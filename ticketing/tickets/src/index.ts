import mongoose from "mongoose";
import { randomBytes } from "crypto";

import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";

const startServer = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    await natsWrapper.connect(
      "ticketing",
      randomBytes(4).toString("hex"),
      "http://nats-srv:4222"
    );

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");

      process.exit();
    });

    process.on("SIGINFO", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    await mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => console.log("Listening on port 3000"));
};

startServer();
