import { Ticket } from "../ticket";

it("implements optimistic concurrency control", async () => {
  const ticket = Ticket.build({
    price: 13,
    title: "asdf",
    userId: "lkjh",
  });

  await ticket.save();

  const fetchedTicket1 = await Ticket.findById(ticket.id);
  const fetchedTicket2 = await Ticket.findById(ticket.id);

  fetchedTicket1!.price = 11;
  await fetchedTicket1!.save();

  fetchedTicket2!.price = 25;
  await expect(fetchedTicket2!.save()).rejects.toThrow();
});

it("increments version number on multiple saves", async () => {
  const ticket = Ticket.build({
    price: 13,
    title: "asdf",
    userId: "lkjh",
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);
});
