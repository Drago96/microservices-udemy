import { OrderCancelledEvent, Publisher, Subject } from "@drptickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subject.OrderCancelled;
}
