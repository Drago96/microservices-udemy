import { Publisher, Subject, TicketNotReservedEvent } from "@drptickets/common";

export class TicketNotReservedPublisher extends Publisher<TicketNotReservedEvent> {
  readonly subject = Subject.TicketNotReserved;
}
