import {
  Listener,
  Subject,
  OrderStatus,
  OrderConfirmedEvent,
} from "@drptickets/common";
import { Message } from "node-nats-streaming";

import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { Order } from "../../models/order";

export class OrderConfirmedLitener extends Listener<OrderConfirmedEvent> {
  readonly subject = Subject.OrderConfirmed;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: OrderConfirmedEvent["data"], msg: Message) {
    const { id, version } = data;

    const order = await Order.findPrevious({ id, version });

    if (!order) {
      throw new Error("Order not found");
    }

    order.status = OrderStatus.AwaitingPayment;
    await order.save();
  }
}
