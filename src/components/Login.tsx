import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.section`
    display: flex;
    justify-content: center;
`;

const Login = () => {

    return (
        <Wrapper>
            <a style={{display: 'block', marginTop: '40px', fontSize: "30px"}} href='https://chatty-back.herokuapp.com/oauth2/authorize/google?redirect_uri=https://chatty-beige.vercel.app/redirect'>Login</a>
        </Wrapper>
    );
};

export default Login;