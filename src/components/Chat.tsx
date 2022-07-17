import React from 'react';
import styled from 'styled-components';
import Footer from './Footer';
import Main from './Main';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import { useFetchCurrentUserQuery } from '../api/apiSlice';
import { Navigate } from 'react-router-dom';
import { Loader } from './Loader';

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Chat = () => {

    const {
        data: userMe,
        isLoading,
        isSuccess,
        isError
    } = useFetchCurrentUserQuery()

    let content

    if (isLoading) {
        content = <Loader />
    } else if (isError) {
        content = <Navigate to="/" />
    } else if (isSuccess) {
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