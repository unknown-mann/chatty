import React, { useRef } from "react";
import SockJsClient from "react-stomp";
import { ACCESS_TOKEN } from "../constants";
import { useQuery } from "@apollo/client";
import { USER_ME, ROOM } from "../apollo/users";
import { useAppSelector } from "../hooks";
import { IRoom } from "../app/types";


const Socket = () => {

  const { data: userMe } = useQuery(USER_ME);

  const currentUser = useAppSelector(state => state.users.activeChat)
  

  const {data: room} = useQuery<IRoom>(ROOM, {
    variables: {
      userId: currentUser.id
    }
  })

  const myEmail = userMe?.me?.email


  let clientRef = useRef();

  const sendMessage = () => {
    clientRef.sendMessage(`/app/message/${room.id}`, JSON.stringify({ name: "Druid" }));
  };

  return (
    <>
      <SockJsClient
        url="https://chatty-back.herokuapp.com/ws"
        topics={[`/user/${myEmail}/msg/${room.id}`]}
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
