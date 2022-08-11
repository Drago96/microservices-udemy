import { Listener, Subject, OrderCreatedEvent } from "@drptickets/common";
import { Message } from "node-nats-streaming";

import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subject.OrderCreated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const { id: orderId, expiresAt } = data;

    const delay = new Date(expiresAt).getTime() - new Date().getTime();

    await expirationQueue.add(
      { orderId },
      {
        delay,
      }
    );
  }
}
