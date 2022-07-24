import React from 'react';
import styled from 'styled-components';
import Footer from './Footer';
import Main from './Main';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import { Navigate } from 'react-router-dom';
import { Loader } from './Loader';
import { useQuery } from "@apollo/client";
import { ROOM, USER_ME } from "../apollo/requests";
import Socket from './Socket';
import { useAppSelector } from '../hooks';

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Chat = () => {

    const currentUser = useAppSelector(state => state.users.activeChat)

    const { data: room } = useQuery(ROOM, {
        variables: {
            userId: currentUser.id
        }
    })

    let clientRefWrapper = {
        clientRef: null
    }

    const sendMessageBySocket = (msg) => {
        clientRefWrapper.clientRef.sendMessage(`/app/message/${room.roomByUserId.id}`, JSON.stringify(msg));
    };

    const { data: userMe, loading: isLoading, error: isError } = useQuery(USER_ME)

    let content

    if (isLoading) {
        content = <Loader />
    } else if (isError) {
        content = <Navigate to="/" />
    } else if (userMe) {
        content =
            <Wrapper>
                <Main>
                    <Sidebar />
                    <ChatWindow sendMessageBySocket={sendMessageBySocket} userMe={userMe} />
                    <Socket clientRefWrapper={clientRefWrapper} />
                </Main>
                <Footer />
            </Wrapper>
    }

    return (
        <>
            {content}
        </>
    )
};

export default Chat;