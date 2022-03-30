import request from "supertest";

import { app } from "../../app";

it("fails with an email that does not exist", () => {
  return request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});

it("fails with an incorrect password", async () => {
  await signup();

  return request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "asdf",
    })
    .expect(400);
});

it("responds with a cookie when given valid credentials", async () => {
  await signup();

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
