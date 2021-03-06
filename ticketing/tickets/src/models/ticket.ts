import { Document, Model, Schema, model } from "mongoose";

interface TicketAttributes {
  title: string;
  price: number;
  userId: string;
}

interface TicketDocument extends Document {
  title: string;
  price: number;
  userId: string;
}

interface TicketModel extends Model<TicketDocument> {
  build(attrs: TicketAttributes): TicketDocument;
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
    },
    userId: {
      type: String,
      required: true,
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

ticketSchema.statics.build = (attrs: TicketDocument) => {
  return new Ticket(attrs);
};

const Ticket = model<TicketDocument, TicketModel>("Ticket", ticketSchema);

export { Ticket };
