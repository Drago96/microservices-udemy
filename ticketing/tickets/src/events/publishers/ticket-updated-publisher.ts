import { Publisher, Subject, TicketUpdatedEvent } from "@drptickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subject.TicketUpdated;
}
