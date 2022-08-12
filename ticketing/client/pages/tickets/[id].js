import Router from "next/router";

import useRequest from "../../hooks/use-request";

const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: { ticketId: ticket.id },
    onSuccess: (order) => Router.push("/orders/[id]", `/orders/${order.id}`),
  });

  return (
    <>
      <h1>{ticket.title}</h1>
      <h4>{ticket.price}</h4>
      <div>{errors}</div>
      <button onClick={() => doRequest()} className="btn btn-primary">
        Purchase
      </button>
    </>
  );
};

TicketShow.getInitialProps = async (context, client, currentUser) => {
  const { id } = context.query;

  const { data } = await client.get(`/api/tickets/${id}`);

  return { ticket: data };
};

export default TicketShow;
