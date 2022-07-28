import React from 'react';
import styled from 'styled-components';

const Container = styled.main`
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 320px 3fr;
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    grid-template-rows: 1fr;
    grid-column-gap: 0px;
    grid-row-gap: 0px;
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