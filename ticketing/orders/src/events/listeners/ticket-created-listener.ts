import { Listener, Subject, TicketCreatedEvent } from "@drptickets/common";
import { Message } from "node-nats-streaming";

import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subject.TicketCreated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { id, price, title } = data;

    const ticket = Ticket.build({
      id,
      price,
      title,
    });

    await ticket.save();
  }
}
