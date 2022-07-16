import React from 'react';
import styled from 'styled-components';
import Footer from './Footer';
import Main from './Main';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Chat = () => {
    return (
        <Wrapper>
            <Main>
                <Sidebar />
                <ChatWindow />
            </Main>
            <Footer />
        </Wrapper>
    );
};

export default Chat;