import {
  Listener,
  OrderStatus,
  Subject,
  TicketReservedEvent,
} from "@drptickets/common";
import { Message } from "node-nats-streaming";

import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { Order } from "../../models/order";
import { OrderConfirmedPublisher } from "../publishers/order-confirmed-publisher";

export class TicketReservedListener extends Listener<TicketReservedEvent> {
  readonly subject = Subject.TicketReserved;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: TicketReservedEvent["data"], msg: Message) {
    const { orderId } = data;

    const order = await Order.findOne({
      id: orderId,
      status: OrderStatus.Created,
    });

    if (!order) {
      throw new Error("Order not found");
    }

    order.status = OrderStatus.AwaitingPayment;
    await order.save();

    await new OrderConfirmedPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });
  }
}
