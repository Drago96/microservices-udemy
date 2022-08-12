import axios from "axios";
import { useState } from "react";

const useRequest = ({ url, method, body = {}, onSuccess }) => {
  const [data, setData] = useState(null);
  const [errors, setErrors] = useState([]);

  const doRequest = async (additionalBodyProps = {}) => {
    setErrors([]);

    try {
      const response = await axios({
        url,
        method,
        data: {
          ...body,
          ...additionalBodyProps,
        },
      });

      setData(response.data);

      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (error) {
      console.log(error);
      setErrors(error.response.data.errors.map((err) => err.message));
    }
  };

  return { doRequest, data, errors };
};

export default useRequest;
