import { Listener, Subject, TicketUpdatedEvent } from "@drptickets/common";
import { Message } from "node-nats-streaming";

import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subject.TicketUpdated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const { id, price, title, version } = data;

    const ticket = await Ticket.findVersioned({ id, version });

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({ title, price });

    await ticket.save();
  }
}
