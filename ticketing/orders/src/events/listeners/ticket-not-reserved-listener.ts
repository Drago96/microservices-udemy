import {
  Listener,
  OrderStatus,
  Subject,
  TicketNotReservedEvent,
} from "@drptickets/common";
import { Message } from "node-nats-streaming";

import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class TicketNotReservedListener extends Listener<TicketNotReservedEvent> {
  readonly subject = Subject.TicketNotReserved;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: TicketNotReservedEvent["data"], msg: Message) {
    const { orderId } = data;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });
  }
}
