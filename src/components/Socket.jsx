import SockJsClient from "react-stomp";
import { ACCESS_TOKEN } from "../constants";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setMessages, setRoom } from "../app/usersSlice";
import { ROOM_BY_ID, SET_READ } from "../apollo/requests";
import { withApollo } from "@apollo/client/react/hoc";


const Socket = ({ clientRefWrapper, client }) => {

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
            let newRoom = Object.assign({}, msg.payload.room)
            newRoom.lastMessage = msg.payload
            if (currentChat.id === newRoom.id) {
              dispatch(setMessages(msg.payload))
              client.mutate({
                mutation: SET_READ,
                variables: { roomId: newRoom.id }
              })
              dispatch(setRoom(newRoom))
            } else {
              const prev = myRooms.find(room => room.id === msg.payload.room.id)
              if (prev) {
                newRoom.unread = prev.unread + 1
                dispatch(setRoom(newRoom))
              } else {
                client.query({
                  query: ROOM_BY_ID,
                  variables: { roomId: newRoom.id }
                })
                  .then(data => {
                    newRoom = data.data.roomById
                    dispatch(setRoom(newRoom))
                  })
                  .catch(err => {
                    console.log(err)
                  })
              }
            }
          }
        }}
        ref={(clientRef) => {
          clientRefWrapper.clientRef = clientRef;
        }}
      />}
    </>
  );
};

export default withApollo(Socket);
