import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';

const Wrapper = styled.section`
    display: flex;
`;

const Button = styled.button`
    width: 150px;
    height: 50px;
    margin: 0 auto;
`;

const Login = () => {

    const { setIsAuth } = useAuth();

    const navigate = useNavigate()

    const onSubmit = () => {
        setIsAuth(true);
        localStorage.setItem('access', 'true')
        navigate("chat")
    }

    return (
        <Wrapper>
            <Button onClick={() => onSubmit()}>
                Login
            </Button>
        </Wrapper>
    );
};

export default Login;