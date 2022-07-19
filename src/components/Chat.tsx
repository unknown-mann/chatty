import React from 'react';
import styled from 'styled-components';
import Footer from './Footer';
import Main from './Main';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import { Navigate } from 'react-router-dom';
import { Loader } from './Loader';
import { useQuery } from "@apollo/client";
import { USER_ME } from "../apollo/users";

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Chat = () => {

    const {
        data: userMe,
        loading: isLoading,
        error: isError
    } = useQuery(USER_ME)

    if (userMe) {
        console.log(userMe.me.email)
    }

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
                    <ChatWindow userMe={userMe} />
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