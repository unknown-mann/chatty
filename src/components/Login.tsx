import React from 'react';
import styled from 'styled-components';
import { IoLogoGoogle } from 'react-icons/io5';
import { FcGoogle } from 'react-icons/fc'

const Wrapper = styled.section`
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Modal = styled.div`
    width: 350px;
    height: 450px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    font-family: Roboto, sans-serif;
    color: rgba(0, 0, 0, 0.6);
    box-shadow: 0 0 10px 3px rgba(221, 221, 221, 1);
    border-radius: 5px;
`;

const Link = styled.a`
    display: flex;
    justify-content: space-evenly;
    width: 80%;  
    padding: 10px;
    font-size: 20px;
    color: rgba(0, 0, 0, 0.6);
    text-decoration: none;
    text-align: center;
    border: 1px solid rgba(0, 0, 0, 0.4);
    border-radius: 5px;
    :hover {
        opacity: 0.8;
    };
    :active {
        opacity: 0.4;
    }
`;

const Title = styled.h1`
    font-size: 30px;
    font-weight: 600;
`;

const Login = () => {

    return (
        <Wrapper>
            <Modal>
                <Title>
                    Welcome to Chatty
                </Title>
                {/* <Link href='https://chatty-back.herokuapp.com/oauth2/authorize/google?redirect_uri=http://localhost:3000/redirect'>
                    <FcGoogle size="25px" />
                    <span>Login with Google</span>
                </Link> */}
                <Link href='https://chatty-back.herokuapp.com/oauth2/authorize/google?redirect_uri=https://chatty-beige.vercel.app/redirect'>
                    <FcGoogle size="25px" />
                    <span>Login with Google</span>
                </Link>
            </Modal>
        </Wrapper>
    );
};

export default Login;