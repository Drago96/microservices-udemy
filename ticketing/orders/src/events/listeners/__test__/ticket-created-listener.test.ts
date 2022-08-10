import { TicketCreatedEvent } from "@drptickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";
import { Ticket } from "../../../models/ticket";

it("creates and saves a ticket", async () => {
  const listener = new TicketCreatedListener(natsWrapper.client);

  const data: TicketCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 13,
    title: "some title",
    userId: "asdf",
    version: 0,
  };

  await listener.onMessage(data, {} as Message);

  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
});
