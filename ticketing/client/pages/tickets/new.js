import Router from "next/router";
import { useState } from "react";

import FormErrors from "../../components/common/form-errors";
import useRequest from "../../hooks/use-request";

const NewTicket = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const { doRequest, errors } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: { title, price },
    onSuccess: () => Router.push("/"),
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    doRequest();
  };

  const onBlur = () => {
    setPrice(parseFloat(price).toFixed(2));
  };

  return (
    <>
      <h1>Create a Ticket</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            value={price}
            type="number"
            onChange={(e) => setPrice(e.target.value)}
            onBlur={onBlur}
            className="form-control"
          />
        </div>
        <FormErrors errors={errors} />
        <input type="submit" className="btn btn-primary" value="Submit" />
      </form>
    </>
  );
};

export default NewTicket;
