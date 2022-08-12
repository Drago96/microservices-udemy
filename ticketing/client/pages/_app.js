import "bootstrap/dist/css/bootstrap.css";

import buildClient from "../api/build-client";
import Header from "../components/common/header";

const App = ({ Component, pageProps, currentUser }) => {
  return (
    <>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </>
  );
};

App.getInitialProps = async ({ ctx: context, Component }) => {
  const client = buildClient(context);

  const { data } = await client.get("/api/users/currentuser");

  let pageProps = {};

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(
      context,
      client,
      data.currentUser
    );
  }

  return {
    pageProps,
    currentUser: data.currentUser,
  };
};

export default App;
