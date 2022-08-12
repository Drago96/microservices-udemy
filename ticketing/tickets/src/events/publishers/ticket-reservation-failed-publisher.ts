import {
  Publisher,
  Subject,
  TicketReservationFailedEvent,
} from "@drptickets/common";

export class TicketReservationFailedPublisher extends Publisher<TicketReservationFailedEvent> {
  readonly subject = Subject.TicketReservationFailed;
}
