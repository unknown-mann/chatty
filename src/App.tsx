import React from 'react';
import Main from './components/Main';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import Footer from './components/Footer';
import styled from 'styled-components';

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const App = () => {
  return (
    <Wrapper>
      <Main>
        <Sidebar />
        <Chat />
      </Main>
      <Footer />
    </Wrapper>
  );
}

export default App;
