import { OrderCreatedEvent, OrderStatus, Subject } from "@drptickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";

it("associates a ticket with an order", async () => {
  const ticket = Ticket.build({
    title: "some title",
    price: 13,
    userId: "asdf",
  });

  await ticket.save();

  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.AwaitingPayment,
    expiresAt: new Date().toISOString(),
    userId: "asdf",
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
    version: 0,
  };

  await listener.onMessage(data, {} as Message);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it("publishes a ticket updated event", async () => {
  const ticket = Ticket.build({
    title: "some title",
    price: 13,
    userId: "asdf",
  });

  await ticket.save();

  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.AwaitingPayment,
    expiresAt: new Date().toISOString(),
    userId: "asdf",
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
    version: 0,
  };

  await listener.onMessage(data, {} as Message);

  expect(natsWrapper.client.publish).toHaveBeenCalledWith(
    Subject.TicketUpdated,
    expect.anything(),
    expect.anything()
  );
});
