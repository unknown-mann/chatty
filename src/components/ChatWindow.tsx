import React from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../hooks';
import { IoPersonAdd } from "react-icons/io5"
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Wrapper = styled.section`
    width: 75%;
`;

const Bar = styled.div`
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 20px;
    font-weight: 500;
    color: #475466;
    font-size: 15px;
}
`;

const User = styled.div`
`;

const Avatar = styled.div`
    padding: 20px;
    border-radius: 50%;
    background-color: aliceblue;
`;

const AddButton = styled.button.attrs({
    type: 'button'
})`
    background: none;
    border: none;
    color: #94A1B3;
`;

const Window = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 91%;
    border-top: 1px solid #DADEE0;
`;

const TextWrapper = styled.div`
    width: 100%;
    display: flex;
    padding: 20px 0;
    border-top: 1px solid #DADEE0;
`;

const TextArea = styled.textarea.attrs({
    placeholder: "Type here..",
})`
    width: 90%;
    margin: 0 auto;
    padding: 10px;
    font-family: Roboto, sans-serif;
    color: #475466;
    background: transparent;
    border: 1px solid #CCD7E6;
    border-radius: 5px;
    :focus {
        outline: none !important;
        border-color: #1CA1C1;
    }
`;

const ChatContent = styled.div`
    padding: 50px;
`;

const ChatWindow = () => {

    const navigate = useNavigate()

    const { setIsAuth } = useAuth();

    const logout = () => {
        setIsAuth(false);
        localStorage.removeItem('accessToken')
        navigate('/')
    }

    const user = useAppSelector(state => state.users.activeChat)

    return (
        <Wrapper>
            <Bar>
                <Avatar />
                <User>
                    {user.name}
                </User>
                <AddButton>
                    <IoPersonAdd size="20px" />
                </AddButton>
                <button onClick={() => logout()}>Log out</button>
            </Bar>
            <Window>
                <ChatContent>
                    {user.body}
                </ChatContent>
                <TextWrapper>
                    <TextArea />
                </TextWrapper>
            </Window>
        </Wrapper>
    );
};

export default ChatWindow;