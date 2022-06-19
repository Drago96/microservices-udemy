import request from "supertest";

import { app } from "../../app";

const createTicket = async ({
  title,
  price,
}: {
  title: string;
  price: number;
}) =>
  request(app).post("/api/tickets").set("Cookie", global.signin()).send({
    title,
    price,
  });

it("can fetch a list of tickets", async () => {
  await createTicket({ title: "Test title 1", price: 10 });
  await createTicket({ title: "Test title 2", price: 20 });

  const response = await request(app).get("/api/tickets").send().expect(200);

  expect(response.body.length).toEqual(2);
  expect(response.body[0].title).toEqual("Test title 1");
  expect(response.body[0].price).toEqual(10);
  expect(response.body[1].title).toEqual("Test title 2");
  expect(response.body[1].price).toEqual(20);
});
