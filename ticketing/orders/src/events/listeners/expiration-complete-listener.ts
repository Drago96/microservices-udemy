import {
  ExpirationCompleteEvent,
  Listener,
  OrderStatus,
  Subject,
} from "@drptickets/common";
import { Message } from "node-nats-streaming";

import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject = Subject.ExpirationComplete;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    const { orderId } = data;

    const order = await Order.findById(orderId).populate("ticket");

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status !== OrderStatus.Complete) {
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
}
