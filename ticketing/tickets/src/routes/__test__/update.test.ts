import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";

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

it("returns 422 if the user provides an invalid title or price", async () => {});

it("updates the ticket with valid inputs", async () => {});
