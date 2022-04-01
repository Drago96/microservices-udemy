import axios from "axios";

const Index = ({ currentUser }) => {
  console.log(currentUser);

  return <h1>Landing Page</h1>;
};

Index.getInitialProps = async () => {
  const response = await axios.get("/api/users/currentuser");

  return { currentUser: response.data.currentUser };
};

export default Index;
