import { TicketUpdatedEvent } from "@drptickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listener";

it("updates an existing ticket", async () => {
  const ticket = Ticket.build({
    price: 13,
    title: "test title",
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  const listener = new TicketUpdatedListener(natsWrapper.client);

  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    price: 11,
    title: "new title",
    userId: "asdf",
    version: 1,
  };

  await listener.onMessage(data, {} as Message);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket?.price).toEqual(11);
  expect(updatedTicket?.title).toEqual("new title");
  expect(updatedTicket?.version).toEqual(1);
});

it("throws an error when ticket has a skipped version", async () => {
  const ticket = Ticket.build({
    price: 13,
    title: "test title",
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  const listener = new TicketUpdatedListener(natsWrapper.client);

  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    price: 11,
    title: "new title",
    userId: "asdf",
    version: 13,
  };

  await expect(listener.onMessage(data, {} as Message)).rejects.toThrow();
});

it("throws an error when the ticket does not exist", async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const data: TicketUpdatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 11,
    title: "new title",
    userId: "asdf",
    version: 1,
  };

  await expect(listener.onMessage(data, {} as Message)).rejects.toThrow();
});
