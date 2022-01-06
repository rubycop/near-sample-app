import React from "react";
import { Container, Wrapper } from "../../assets/styles/common.style";
import { Header } from "../Header";
import { OrdersTable } from "../OrdersTable";

export const Home = ({ currentUser }) => {
  return (
    <>
      <Header currentUser={currentUser} />
      <Wrapper>
        <Container className="pt-20 flex">
          <div className="w-1/2">
            <h1 className="text-6xl leading-tight">
              Welcome to Smart Procure-To-Pay
            </h1>
            <h3 className="my-10 text-xl leading-normal">
              Here you can sign your orders, approve them and make your
              procurement flow paperless
            </h3>
            <a
              className="underline text-blue-500 hover:text-blue-800"
              href="https://www.airbase.com/blog/procure-to-pay-software"
            >
              What Procure-To-Pay (P2P) is?
            </a>
          </div>
          <div className="w-1/2">
            <img
              src="https://global-uploads.webflow.com/5e0cb3903f3d95735aa4f74d/5eb31978b5be341e80b764c3_OG-Procure-to-Pay-p-800.png"
              alt="p2p"
            />
          </div>
        </Container>
        {currentUser && (
          <Container className="py-20">
            <OrdersTable currentUser={currentUser} />
          </Container>
        )}
      </Wrapper>
    </>
  );
};
