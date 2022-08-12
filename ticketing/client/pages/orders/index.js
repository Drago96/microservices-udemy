import Link from "next/link";

const OrdersIndex = ({ orders }) => {
  return (
    <ul>
      {orders.map((order) => (
        <li key={order.id}>
          {order.ticket.title} - {order.status}{" "}
          {order.status === "awaiting_payment" && (
            <Link href="/orders/[id]" as={`/orders/${order.id}`}>
              <a>View</a>
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
};

OrdersIndex.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get("/api/orders");

  return { orders: data };
};

export default OrdersIndex;
