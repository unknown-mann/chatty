import React from 'react';
import styled from 'styled-components';
import Footer from './Footer';
import Main from './Main';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import { Navigate } from 'react-router-dom';
import { Loader } from './Loader';
import { useQuery } from "@apollo/client";
import { USER_ME } from "../apollo/requests";
import Socket from './Socket';
import { useAppSelector, useAppDispatch } from '../hooks';
import Header from './Header';
import { setCurrentUser } from '../app/usersSlice';

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Wrapper = styled.section`
    width: 78%;
`;

const Welcome = styled.div`
    padding-top: 20%;
    height: 100%;
    font-size: 30px;
    text-align: center;
`;

const Chat = () => {

    const currentChat = useAppSelector(state => state.users.activeChat)

    let clientRefWrapper = {
        clientRef: null
    }

    const sendMessageBySocket = (msg) => {
        clientRefWrapper.clientRef.sendMessage(`/app/message/${currentChat.id}`, JSON.stringify(msg));
    };

    const dispatch = useAppDispatch()
    const { data: userMe, loading: isLoading, error: isError } = useQuery(USER_ME)

    if (!isLoading) {
        dispatch(setCurrentUser(userMe.me))
    }


    let content

    if (isLoading) {
        content = <Loader />
    } else if (isError) {
        content = <Navigate to="/" />
    } else if (userMe) {
        content =
            <Container>
                <Main>
                    <Sidebar />
                    <Wrapper>
                        <Header userMe={userMe} />
                        {currentChat.id ?
                            <ChatWindow sendMessageBySocket={sendMessageBySocket} userMe={userMe} />
                            :
                            <Welcome>Welcome to Chatty</Welcome>}
                    </Wrapper>
                    <Socket clientRefWrapper={clientRefWrapper} />
                </Main>
                <Footer />
            </Container>
    }

    return (
        <>
            {content}
        </>
    )
};

export default Chat;