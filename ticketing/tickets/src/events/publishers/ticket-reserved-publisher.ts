import { Publisher, Subject, TicketReservedEvent } from "@drptickets/common";

export class TicketReservedPublisher extends Publisher<TicketReservedEvent> {
  readonly subject = Subject.TicketReserved;
}
