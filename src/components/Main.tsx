import React from 'react';
import styled from 'styled-components';

const Container = styled.main`
    width: 100%;
    min-width: 1000px;
    height: 100%;
    display: flex;
    font-family: Roboto, sans-serif;
    border: 1px solid #DADEE0;
`;

type PropsType = {
    children: React.ReactNode
};

const Main: React.FC<PropsType> = ({children}) => {
    return (
        <Container>
            {children}
        </Container>
    );
};

export default Main;