import { OrderCancelledEvent, OrderStatus, Subject } from "@drptickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";

it("associates a ticket with an order", async () => {
  const ticket = Ticket.build({
    title: "some title",
    price: 13,
    userId: "asdf",
  });

  ticket.orderId = new mongoose.Types.ObjectId().toHexString();

  await ticket.save();

  const listener = new OrderCancelledListener(natsWrapper.client);

  const data: OrderCancelledEvent["data"] = {
    id: ticket.orderId,
    ticket: {
      id: ticket.id,
    },
    version: 0,
  };

  await listener.onMessage(data, {} as Message);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).not.toBeDefined();
});

it("publishes a ticket updated event", async () => {
  const ticket = Ticket.build({
    title: "some title",
    price: 13,
    userId: "asdf",
  });

  ticket.orderId = new mongoose.Types.ObjectId().toHexString();

  await ticket.save();

  const listener = new OrderCancelledListener(natsWrapper.client);

  const data: OrderCancelledEvent["data"] = {
    id: ticket.orderId,
    ticket: {
      id: ticket.id,
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
