import { Stan } from "node-nats-streaming";
import { Subject } from "./subject";

interface Event {
  subject: Subject;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T["subject"];

  constructor(private client: Stan) {}

  publish(data: T["data"]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (error) => {
        if (error) {
          return reject(error);
        }

        console.log("Event published");

        resolve();
      });
    });
  }
}
