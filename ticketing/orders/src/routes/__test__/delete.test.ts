import { OrderStatus, Subject } from "@drptickets/common";
import mongoose from "mongoose";
import request from "supertest";

import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("deletes the order", async () => {
  const ticket = Ticket.build({
    title: "some title",
    price: 13,
  });

  await ticket.save();

  const user = global.signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const response = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(response.body.id).toEqual(order.id);
  expect(response.body.status).toEqual(OrderStatus.Cancelled);
});

it("returns an error when order does not exist", async () => {
  await request(app)
    .delete(`/api/orders/${new mongoose.Types.ObjectId()}`)
    .set("Cookie", global.signin())
    .send()
    .expect(404);
});

it("returns an error when another user fetches the order", async () => {
  const ticket = Ticket.build({
    title: "some title",
    price: 13,
  });

  await ticket.save();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", global.signin())
    .send()
    .expect(403);
});

it("emits an order cancelled event", async () => {
  const ticket = Ticket.build({
    title: "some title",
    price: 13,
  });

  await ticket.save();

  const user = global.signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalledWith(
    Subject.OrderCancelled,
    expect.anything(),
    expect.anything()
  );
});
