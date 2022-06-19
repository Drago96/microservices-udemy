import "bootstrap/dist/css/bootstrap.css";

import buildClient from "../api/build-client";
import Header from "../components/common/header";

const App = ({ Component, pageProps, currentUser }) => {
  return (
    <>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </>
  );
};

App.getInitialProps = async ({ ctx: context, Component }) => {
  const { data } = await buildClient(context).get("/api/users/currentuser");

  let pageProps = {};

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(context);
  }

  return {
    pageProps,
    currentUser: data.currentUser,
  };
};

export default App;
