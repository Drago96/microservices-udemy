import { Publisher, Subject, TicketCreatedEvent } from "@drptickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subject.TicketCreated;
}
