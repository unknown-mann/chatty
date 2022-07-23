import SockJsClient from "react-stomp";
import { ACCESS_TOKEN } from "../constants";
import { useQuery } from "@apollo/client";
import { USER_ME, ROOM } from "../apollo/requests";
import { useAppSelector } from "../hooks";


const Socket = () => {

  const currentUser = useAppSelector(state => state.users.activeChat)

  const { data: userMe } = useQuery(USER_ME);

  const myEmail = userMe?.me?.email

  const { data: room } = useQuery(ROOM, {
    variables: {
      userId: currentUser.id
    }
  })

  let clientRef

  return (
    <>
      {currentUser.id && room && <SockJsClient
        url="https://chatty-back.herokuapp.com/ws"
        topics={[`/user/${myEmail}/msg/${room.roomByUserId.id}`]}
        headers={{
          Authorization: "Bearer " + localStorage.getItem(ACCESS_TOKEN),
        }}
        onMessage={(msg) => {
        }}
        ref={(client) => {
          clientRef = client;
        }}
      />}
    </>
  );
};

export default Socket;
