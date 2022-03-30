import request from "supertest";

import { app } from "../../app";

it("returns 201 on successful signup", () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});

it("returns 422 with an invalid email", () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "invalid email",
      password: "password",
    })
    .expect(422);
});

it("returns 422 with an invalid email", () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "inv",
    })
    .expect(422);
});

it("returns 422 with missing email and password", () => {
  return request(app).post("/api/users/signup").send({}).expect(422);
});

it("returns 409 when user already exists", async () => {
  await request(app).post("/api/users/signup").send({
    email: "test@test.com",
    password: "password",
  });

  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(409);
});

it("sets a cookie after succesful signup", async () => {
  const response = await request(app).post("/api/users/signup").send({
    email: "test@test.com",
    password: "password",
  });

  expect(response.get("Set-Cookie")).toBeDefined();
});
