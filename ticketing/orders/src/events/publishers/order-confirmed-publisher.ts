import { OrderConfirmedEvent, Publisher, Subject } from "@drptickets/common";

export class OrderConfirmedPublisher extends Publisher<OrderConfirmedEvent> {
  readonly subject = Subject.OrderConfirmed;
}
