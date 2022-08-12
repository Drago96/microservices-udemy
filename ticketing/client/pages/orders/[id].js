import Router from "next/router";
import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";

import useRequest from "../../hooks/use-request";

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const findTimeLeft = () => {
      const expiresIn = new Date(order.expiresAt) - new Date();

      setTimeLeft(Math.round(expiresIn / 1000));
    };

    findTimeLeft();

    const timeLeftInterval = setInterval(findTimeLeft, 1000);

    return () => clearInterval(timeLeftInterval);
  }, [order]);

  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: { orderId: order.id },
    onSuccess: (order) => Router.push("/orders"),
  });

  if (timeLeft <= 0) {
    return <div>Order Expired</div>;
  }

  return (
    <>
      <div>Time left to pay: {timeLeft} seconds</div>
      <div>{errors}</div>
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey={
          "pk_test_51LVkdADD0tTmWLBCBVcdLu2EpffjWBUNXMce6vZ1n4p1C8otQxRbXyTE87P2ZKGa9bTYkV14zuGFMRWujqMToKmm00TRxs92nm"
        }
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
    </>
  );
};

OrderShow.getInitialProps = async (context, client, currentUser) => {
  const { id } = context.query;

  const { data } = await client.get(`/api/orders/${id}`);

  return { order: data };
};

export default OrderShow;
