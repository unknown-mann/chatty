import SockJsClient from "react-stomp";
import { ACCESS_TOKEN } from "../constants";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setMessages, setRoom } from "../app/usersSlice";


const Socket = ({ clientRefWrapper }) => {

  const dispatch = useAppDispatch()

  const currentChat = useAppSelector(state => state.users.activeChat)
  const currentUser = useAppSelector(state => state.users.currentUser)
  const myRooms = useAppSelector(state => state.users.rooms)

  return (
    <>
      {currentUser.id && <SockJsClient
        url="https://chatty-back.herokuapp.com/ws"
        topics={[`/user/${currentUser.email}/msg`]}
        headers={{
          Authorization: "Bearer " + localStorage.getItem(ACCESS_TOKEN),
        }}
        onMessage={(msg) => {
          if (msg.type === "MESSAGE") {
            const newRoom = Object.assign({}, msg.payload.room)
            newRoom.lastMessage = msg.payload
            if (currentChat.id === msg.payload.room.id) {
              dispatch(setMessages(msg.payload))
            } else {
              const prev = myRooms.find(room => room.id === msg.payload.room.id)
              if (prev) {
                newRoom.unread = prev.unread + 1
              }
              // TODO иначе грузить room из бэка
            }
            dispatch(setRoom(newRoom))
          }
        }}
        ref={(client) => {
          clientRefWrapper.clientRef = client;
        }}
      />}
    </>
  );
};

export default Socket;
