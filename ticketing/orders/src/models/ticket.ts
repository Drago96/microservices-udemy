import { OrderStatus } from "@drptickets/common";
import { Document, Model, Schema, model, ObjectId } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

import { Order } from "./order";

interface TicketAttributes {
  id?: string;
  title: string;
  price: number;
}

export interface TicketDocument extends Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
  version: number;
}

interface TicketModel extends Model<TicketDocument> {
  build(attrs: TicketAttributes): TicketDocument;
  findVersioned(event: {
    id: string;
    version: number;
  }): Promise<TicketDocument | null>;
}

const ticketSchema = new Schema<TicketDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
      versionKey: false,
    },
  }
);

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: TicketAttributes) => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  });
};

ticketSchema.statics.findVersioned = async (event: {
  id: string;
  version: number;
}) => {
  return Ticket.findOne({ _id: event.id, version: event.version - 1 });
};

ticketSchema.methods.isReserved = async function () {
  return Order.exists({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });
};

const Ticket = model<TicketDocument, TicketModel>("Ticket", ticketSchema);

export { Ticket };
