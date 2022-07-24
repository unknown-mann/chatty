import SockJsClient from "react-stomp";
import { ACCESS_TOKEN } from "../constants";
import { useQuery } from "@apollo/client";
import { USER_ME, ROOM } from "../apollo/requests";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setMessages } from "../app/usersSlice";


const Socket = ({ clientRef }) => {

  const dispatch = useAppDispatch()

  const currentUser = useAppSelector(state => state.users.activeChat)

  const { data: userMe } = useQuery(USER_ME);

  const myEmail = userMe?.me?.email

  const { data: room } = useQuery(ROOM, {
    variables: {
      userId: currentUser.id
    }
  })

  return (
    <>
      {currentUser.id && room && <SockJsClient
        url="https://chatty-back.herokuapp.com/ws"
        topics={[`/user/${myEmail}/msg/${room.roomByUserId.id}`]}
        headers={{
          Authorization: "Bearer " + localStorage.getItem(ACCESS_TOKEN),
        }}
        onMessage={(msg) => {
          dispatch(setMessages(msg))
        }}
        ref={(client) => {
          clientRef = client;
        }}
      />}
    </>
  );
};

export default Socket;
