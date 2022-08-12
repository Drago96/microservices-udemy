import { Listener, Subject, OrderCreatedEvent } from "@drptickets/common";
import { Message } from "node-nats-streaming";

import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { TicketNotReservedPublisher } from "../publishers/ticket-not-reserved-publisher";
import { TicketReservedPublisher } from "../publishers/ticket-reserved-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subject.OrderCreated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const {
      id: orderId,
      ticket: { id: ticketId, version },
    } = data;

    const ticket = await Ticket.findOne({ _id: ticketId, version });

    if (!ticket) {
      await new TicketNotReservedPublisher(this.client).publish({
        id: ticketId,
        orderId,
        version,
      });

      throw new Error("Cannot reserve ticket");
    }

    ticket.orderId = orderId;
    await ticket.save();

    await Promise.all([
      new TicketReservedPublisher(this.client).publish({
        id: ticketId,
        orderId,
        version: ticket.version,
      }),
      new TicketUpdatedPublisher(this.client).publish({
        id: ticket.id,
        price: ticket.price,
        title: ticket.title,
        userId: ticket.userId,
        orderId: orderId,
        version: ticket.version,
      }),
    ]);
  }
}
