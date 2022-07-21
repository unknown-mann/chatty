import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../hooks';
import { IoPerson, IoLogOutOutline, IoPersonAdd } from "react-icons/io5"
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProfileModal from './ProfileModal';
import { UserType } from '../app/types';
import RequestsModal from './RequestsModal';
import { useMutation, useQuery } from '@apollo/client';
import { FRIEND_REQUESTS, MESSAGE_BY_USER, SEND_MESSAGE } from '../apollo/requests'
import { ACCESS_TOKEN } from '../constants';
import { IRequests } from '../app/types';
import { IMessagesByUserId } from '../app/types';
import { Spinner } from './Spinner';


const Wrapper = styled.section`
    width: 78%;
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

const Avatar = styled.img`
    width: 35px;
    height: 35px;
    border-radius: 50%;
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
    flex-direction: column;
    padding: 20px 0;
    border-top: 1px solid #DADEE0;
`;

const TextArea = styled(motion.textarea).attrs({
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
    resize: none;
    :focus {
        outline: none !important;
        border-color: #1CA1C1;
    }
`;

const ChatContent = styled.div`
    padding: 50px;
`;

const MessagesList = styled.ul`
    list-style-type: none;
`;

const MessageItem = styled.li`

`;

const ButtonGroup = styled.div`
    display: flex;
    align-items: center;
    color: #94A1B3;
`;

const Button = styled.button<{ active?: boolean }>`
    position: relative;
    margin-left: 10px;
    padding: 5px;
    background: none;
    border: none;
    cursor: pointer;
    opacity: ${props => props.active ? '1' : '0.6'};
    :hover {
        opacity: 1;
    };
    :active {
        opacity: 0.5;
    };
`;

const RequestsNum = styled.span<{ reqs: boolean }>`
    position: absolute;
    top: 10px;
    right: 30px;
    width: 15px;
    height: 15px;
    font-size: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    background: ${props => props.reqs ? 'green' : 'red'};
    border-radius: 50%;
`;

const SendButton = styled.button`
    width: 70px;
    align-self: flex-end;
    margin-right: 5%;
    margin-top: 15px;
    font-size: 16px;
    color: white;
    background-color: #1ca1c1;
    border: none;
    border-radius: 5px;
    padding: 10px;
    cursor: pointer;
    :hover {
        background-color: #0b829e;
    }
    :active {
        background-color: #0b768f;
    }
    :disabled {
        color: #94A1B3;
        background: #f4f5f9;
        cursor: not-allowed;
    }
`;

type PropsType = {
    userMe: {
        me: UserType
    }
}

const ChatWindow: React.FC<PropsType> = ({ userMe }) => {

    const navigate = useNavigate()

    const { setIsAuth } = useAuth();

    const logout = () => {
        setIsAuth(false);
        localStorage.removeItem(ACCESS_TOKEN)
        navigate('/')
    }

    const currentUser = useAppSelector(state => state.users.activeChat)

    const [profileModalActive, setProfileModalActive] = useState(false)
    const [requestsModalActive, setRequestsModalActive] = useState(false)

    const { data: messages, loading: msgLoading, error: msgError } = useQuery<IMessagesByUserId>(MESSAGE_BY_USER, {
        variables: {
            userId: currentUser.id,
            pageNum: 0,
            pageSize: 10
        }
    })

    console.log(messages)

    let messagesContent

    if (msgLoading) {
        messagesContent = <Spinner text='Loading'/>
    } else if (msgError) {
        messagesContent = <div>{msgError.message}</div>
    } else if (messages) {
        messagesContent = 
        messages.messagesByUserId.length ?
        <MessagesList>
        {messages.messagesByUserId.map(msg => (
            <MessageItem key={msg.id}>
                {msg.text}
            </MessageItem>
        ))}
        </MessagesList>
        : <div>There isn't messages yet</div>
    }

    const { data: reqData, loading: reqLoading, error: reqError } = useQuery<IRequests>(FRIEND_REQUESTS)

    const reqLength = reqData?.friendRequests.length

    const [text, setText] = useState('');

    const [sendMessage] = useMutation(SEND_MESSAGE, {
        variables: {
            message: {
                text,
                fileIds: ''
            },
            userId: currentUser.id
        },
        onCompleted: (data) => {
            console.log(data)
        }
    })

    const handleSendMessage = () => {
        sendMessage()
        setText('')
    }
    console.log(text)

    return (
        <Wrapper>
            <Bar>
                <Avatar src={currentUser.googleImgUrl} />
                <User>
                    {currentUser.firstname} {' '} {currentUser.lastname}
                </User>
                <ButtonGroup>
                    <Button onClick={() => setRequestsModalActive(true)} active={requestsModalActive}>
                        <IoPersonAdd size="20px" />
                        {!reqLoading &&
                            <RequestsNum reqs={Boolean(reqLength)}>
                                {reqLength}
                            </RequestsNum>}
                    </Button>
                    <Button onClick={() => setProfileModalActive(true)} active={profileModalActive}>
                        <IoPerson size="20px" />
                    </Button>
                    <Button onClick={() => logout()}>
                        <IoLogOutOutline size="25px" />
                    </Button>
                </ButtonGroup>
            </Bar>
            <Window>
                <ChatContent>
                    {currentUser.id && messagesContent}
                </ChatContent>
                <TextWrapper>
                    <TextArea value={text} onChange={evt => setText(evt.target.value)} whileFocus={{ height: 150 }} />
                    <SendButton disabled={!text} onClick={(handleSendMessage)}>Send</SendButton>
                </TextWrapper>
            </Window>
            {profileModalActive &&
                <ProfileModal userMe={userMe} modalActive={profileModalActive} setModalActive={setProfileModalActive} />}
            {requestsModalActive && reqData &&
                <RequestsModal modalActive={requestsModalActive} setModalActive={setRequestsModalActive} reqData={reqData} reqLoading={reqLoading} reqError={reqError} />}
        </Wrapper>
    );
};

export default ChatWindow;