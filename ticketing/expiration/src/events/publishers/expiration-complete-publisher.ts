import {
  ExpirationCompleteEvent,
  Publisher,
  Subject,
} from "@drptickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subject.ExpirationComplete;
}
