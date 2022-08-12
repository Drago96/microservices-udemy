import { PaymentCreatedEvent, Publisher, Subject } from "@drptickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subject.PaymentCreated;
}
