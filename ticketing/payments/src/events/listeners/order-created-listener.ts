import { Listener, Subject, OrderCreatedEvent } from "@drptickets/common";
import { Message } from "node-nats-streaming";

import { Order } from "../../models/order";
import { QUEUE_GROUP_NAME } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subject.OrderCreated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const {
      id,
      userId,
      status,
      ticket: { price },
    } = data;

    const order = Order.build({
      id,
      userId,
      status,
      price,
    });

    await order.save();
  }
}
