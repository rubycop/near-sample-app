import { LoginIcon, LogoutIcon } from "@heroicons/react/solid";
import React from "react";
import { Container, Row } from "../assets/styles/common.style";
import { login, logout } from "../utils/nearApi";

export const Header = ({ currentUser }) => {
  return (
    <div className="sticky top-0 z-50 py-5 bg-slate-800">
      <Container>
        <Row className="justify-between">
          <Row>
            <span className="text-xl font-bold text-white">Smart P2P</span>
          </Row>
          {currentUser ? (
            <div className="flex flex-row items-center">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="ml-3 mr-10 text-white">
                {currentUser.accountId}
              </div>
              <button
                className="flex flex-row items-center text-white p-3 px-5 border-2 rounded-full hover:border-orange-500 hover:text-orange-500"
                onClick={logout}
              >
                <Row className="justify-between">
                  Sign Out
                  <LogoutIcon className="ml-3 h-5 w-5" />
                </Row>
              </button>
            </div>
          ) : (
            <button
              className="flex flex-row items-center text-white p-3 px-5 rounded-full bg-orange-600"
              onClick={login}
            >
              <Row className="justify-between">
                Connect to wallet
                <LoginIcon className="ml-3 h-5 w-5" />
              </Row>
            </button>
          )}
        </Row>
      </Container>
    </div>
  );
};
