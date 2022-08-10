import { OrderCreatedEvent, Publisher, Subject } from "@drptickets/common";

export class OrderCreatedPublihser extends Publisher<OrderCreatedEvent> {
  readonly subject = Subject.OrderCreated;
}
