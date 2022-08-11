import request from "supertest";
import mongoose from "mongoose";
import { Subject } from "@drptickets/common";

import { app } from "../../app";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/ticket";

it("returns a 404 if the ticket is not found", async () => {
  await request(app)
    .put(`/api/tickets/${new mongoose.Types.ObjectId().toHexString()}`)
    .set("Cookie", global.signin())
    .send({ title: "Test title", price: 10 })
    .expect(404);
});

it("returns 401 if the user is not authenticated", async () => {
  await request(app)
    .put(`/api/tickets/${new mongoose.Types.ObjectId().toHexString()}`)
    .send()
    .expect(401);
});

it("returns 403 if the user does not own the ticket", async () => {
  const createResponse = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "Test title 1", price: 10 });

  await request(app)
    .put(`/api/tickets/${createResponse.body.id}`)
    .set("Cookie", global.signin())
    .send({ title: "Test title 2", price: 20 })
    .expect(403);
});

it("returns 400 if the ticket is reserved", async () => {
  const cookie = global.signin();

  const createResponse = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "Test title 1", price: 10 });

  const ticket = await Ticket.findById(createResponse.body.id);

  ticket!.orderId = "asdf";
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${createResponse.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "Test title 2", price: 20 })
    .expect(400);
});

it("returns 422 if the user provides an invalid title or price", async () => {
  const cookie = global.signin();

  const createResponse = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "Test title 1", price: 10 });

  await request(app)
    .put(`/api/tickets/${createResponse.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "", price: 20 })
    .expect(422);

  await request(app)
    .put(`/api/tickets/${createResponse.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "Test title 2", price: -20 })
    .expect(422);
});

it("updates the ticket with valid inputs", async () => {
  const cookie = global.signin();

  const createResponse = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "Test title 1", price: 10 });

  const updateResponse = await request(app)
    .put(`/api/tickets/${createResponse.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "Test title 2", price: 20 })
    .expect(200);

  expect(updateResponse.body.title).toEqual("Test title 2");
  expect(updateResponse.body.price).toEqual(20);
});

it("publishes an event", async () => {
  const cookie = global.signin();

  const createResponse = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "Test title 1", price: 10 });

  await request(app)
    .put(`/api/tickets/${createResponse.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "Test title 2", price: 20 })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalledWith(
    Subject.TicketUpdated,
    expect.anything(),
    expect.anything()
  );
});
