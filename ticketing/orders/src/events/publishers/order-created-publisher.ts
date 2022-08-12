import { OrderCreatedEvent, Publisher, Subject } from "@drptickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subject.OrderCreated;
}
