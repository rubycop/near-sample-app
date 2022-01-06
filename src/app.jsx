import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./components/pages";
import { initContract } from "./utils/nearApi";

export const App = () => {
  const [currentUser, setCurrentUser] = React.useState(false);

  React.useEffect(() => {
    window.nearInitPromise = initContract()
      .then(() => {
        setCurrentUser(
          window.walletConnection.isSignedIn()
            ? {
                accountId: window.walletConnection?.getAccountId(),
                amount: "",
              }
            : console.log("not logged in")
        );
      })
      .catch(console.error);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home currentUser={currentUser} />} />
      </Routes>
    </BrowserRouter>
  );
};
