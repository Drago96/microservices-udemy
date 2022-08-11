import { Listener, Subject, OrderCreatedEvent } from "@drptickets/common";
import { Message } from "node-nats-streaming";

import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subject.OrderCreated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const {
      id: orderId,
      ticket: { id: ticketId },
    } = data;

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.orderId = orderId;

    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: orderId, 
      version: ticket.version,
    });
  }
}
