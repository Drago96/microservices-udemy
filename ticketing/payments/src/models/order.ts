import { OrderStatus } from "@drptickets/common";
import { Document, Model, Schema, model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderAttributes {
  id: string;
  userId: string;
  status: OrderStatus;
  price: number;
}

interface OrderDocument extends Document {
  userId: string;
  status: OrderStatus;
  price: number;
  version: number;
}

interface OrderModel extends Model<OrderDocument> {
  build(attrs: OrderAttributes): OrderDocument;
  findVersioned(event: {
    id: string;
    version: number;
  }): Promise<OrderDocument | null>;
}

const orderSchema = new Schema<OrderDocument>(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    price: {
      type: Number,
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

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttributes) => {
  return new Order({
    _id: attrs.id,
    userId: attrs.userId,
    price: attrs.price,
    status: attrs.status,
  });
};

orderSchema.statics.findVersioned = async (event: {
  id: string;
  version: number;
}) => {
  return Order.findOne({ _id: event.id, version: event.version - 1 });
};

const Order = model<OrderDocument, OrderModel>("Order", orderSchema);

export { Order };
