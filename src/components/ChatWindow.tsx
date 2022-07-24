import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../hooks';
import { IoPerson, IoLogOutOutline, IoPersonAdd } from "react-icons/io5"
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProfileModal from './ProfileModal';
import { UserType } from '../types';
import RequestsModal from './RequestsModal';
import { useMutation, useQuery } from '@apollo/client';
import { FRIEND_REQUESTS, MESSAGE_BY_USER, SEND_MESSAGE } from '../apollo/requests'
import { ACCESS_TOKEN } from '../constants';
import { IRequests } from '../types';
import { IMessagesByUserId } from '../types';
import { Spinner } from './Spinner';
import { setMessages } from '../app/usersSlice';


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

const Window = styled.div<{ active: boolean }>`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 91%;
    border-top: 1px solid #DADEE0;
`;

const ChatContent = styled.div`
    padding: 30px;
    padding-top: 0;
    margin-top: auto;
    overflow: auto;
`;

const TextWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 20px 0;
    border-top: 1px solid #DADEE0;
`;

const TextArea = styled(motion.textarea).attrs({
    placeholder: "Type here..",
})`
    width: 80%;
    margin: 0 auto;
    padding: 10px;
    font-family: Roboto, sans-serif;
    font-size: 14px;
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

const MessagesList = styled.ul`
    list-style-type: none;
`;

const MessageItem = styled.li`
    display: flex;
    margin-top: 20px;
    font-size: 14px;
    line-height: 20px;
`;

const MessageWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
`;

const SenderAvatar = styled(Avatar)`
    margin-right: 20px;
    margin-top: 3px;
`;

const MessageSender = styled.div`
    margin-bottom: 10px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.7);
`;

const MessageContent = styled.div`
    font-weight: 400;
    color: #475466;
`;

const TimeStamp = styled.div`

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

type PropsType = {
    userMe: {
        me: UserType
    },
    sendMessageBySocket: (arg: any) => void
}

const ChatWindow: React.FC<PropsType> = ({ userMe, sendMessageBySocket }) => {

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
            pageSize: 20
        }
    })

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (messages?.messagesByUserId) {
            dispatch(setMessages(messages.messagesByUserId))
        }
    }, [messages])

    const AllMessages = useAppSelector(state => state.users.messages)

    let messagesContent

    if (msgLoading) {
        messagesContent = <Spinner />
    } else if (msgError) {
        messagesContent = <div>{msgError.message}</div>
    } else if (messages && AllMessages) {
        messagesContent =
            AllMessages.length ?
                <MessagesList>
                    {AllMessages.map(msg => (
                        <MessageItem key={msg.id}>
                            <SenderAvatar src={msg.user.googleImgUrl} />
                            <MessageWrapper>
                                <div>
                                    <MessageSender>{msg.user.firstname} {msg.user.lastname}</MessageSender>
                                    <MessageContent>{msg.text}</MessageContent>
                                </div>
                                <TimeStamp>{new Date(msg.createdAt).toLocaleString('en-GB')}</TimeStamp>
                            </MessageWrapper>
                        </MessageItem>
                    ))}
                </MessagesList>
                : <div>There isn't messages yet</div>
    }

    const { data: reqData, loading: reqLoading, error: reqError } = useQuery<IRequests>(FRIEND_REQUESTS, {
        variables: {
            pageNum: 0,
            pageSize: 10
        }
    })

    const reqLength = reqData?.friendRequests.length

    const [text, setText] = useState('');

    const [sendMessage] = useMutation(SEND_MESSAGE, {
        variables: {
            message: {
                text: text,
                fileIds: []
            },
            userId: currentUser.id
        }
    })

    const handleSendMessage = () => {
        sendMessage()
        sendMessageBySocket({
            id: currentUser.id,
            text,
            fileIds: [],
            createdAt: new Date().toUTCString(),
            user: {
                id: userMe.me.id,
                email: userMe.me.email,
                firstname: userMe.me.firstname,
                lastname: userMe.me.lastname,
                googleImgUrl: userMe.me.googleImgUrl

            }
        })
        setText('')
        dispatch(setMessages({
            id: currentUser.id,
            text,
            fileIds: [],
            createdAt: new Date().toUTCString(),
            user: {
                id: userMe.me.id,
                email: userMe.me.email,
                firstname: userMe.me.firstname,
                lastname: userMe.me.lastname,
                googleImgUrl: userMe.me.googleImgUrl

            }
        }))
    }

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
            <Window active={Boolean(currentUser.id)}>
                {currentUser.id ?
                    <>
                        <ChatContent>
                            {messagesContent}
                        </ChatContent>
                        <TextWrapper>
                            <TextArea value={text} onChange={evt => setText(evt.target.value)} whileFocus={{ height: 150 }} />
                            <SendButton disabled={!text} onClick={(handleSendMessage)}>Send</SendButton>
                        </TextWrapper>
                    </>
                    :
                    <div style={{ margin: '20% auto 0 auto', fontSize: '30px' }}>Welcome to Chatty</div>}
            </Window>
            {profileModalActive &&
                <ProfileModal userMe={userMe} modalActive={profileModalActive} setModalActive={setProfileModalActive} />}
            {requestsModalActive && reqData &&
                <RequestsModal modalActive={requestsModalActive} setModalActive={setRequestsModalActive} reqData={reqData} reqLoading={reqLoading} reqError={reqError} />}
        </Wrapper>
    );
};

export default ChatWindow;