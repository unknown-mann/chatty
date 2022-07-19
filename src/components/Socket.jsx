import React, { useRef } from "react";
import SockJsClient from "react-stomp";
import { ACCESS_TOKEN } from "../constants";
import { useQuery } from "@apollo/client";
import { USER_ME } from "../apollo/users";

const Socket = () => {

  const { data: userMe } = useQuery(USER_ME);

  const myEmail = userMe?.me?.email


  let clientRef = useRef();

  const sendMessage = () => {
    clientRef.sendMessage("/app/message/1", JSON.stringify({ name: "Druid" }));
  };

  return (
    <>
      <SockJsClient
        url="https://chatty-back.herokuapp.com/ws"
        topics={[`/user/${myEmail}/msg/1`]}
        headers={{
          Authorization: "Bearer " + localStorage.getItem(ACCESS_TOKEN),
        }}
        onMessage={(msg) => {
          console.log(msg);
        }}
        ref={(client) => {
          clientRef = client;
        }}
      />
      <button onClick={() => sendMessage()}>Send</button>
    </>
  );
};

export default Socket;
