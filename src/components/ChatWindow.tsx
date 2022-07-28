import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../hooks';
import { motion } from 'framer-motion';
import { IMessagesByRoomId, UserType } from '../types';
import { useMutation, useQuery } from '@apollo/client';
import { MESSAGES_BY_ROOM, SEND_MESSAGE_TO_ROOM } from '../apollo/requests'
import { setMessages, setRoom } from '../app/usersSlice';
import { BeatLoader } from "react-spinners";

const Avatar = styled.img`
    width: 35px;
    height: 35px;
    border-radius: 50%;
`;

const Window = styled.div<{ active: boolean }>`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 80vh;
`;

const ChatContent = styled.div`
    width: 100%;
    padding: 0 30px 10px 30px;
    @media (max-width: 768px) {
        padding: 0 15px 10px 15px;
    }
    margin-top: auto;
    overflow: auto;
`;

const TextWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 0;
    border-top: 1px solid #DADEE0;
    @media(max-width: 768px) {
        flex-direction: column;
    };
`;

const TextArea = styled(motion.textarea).attrs({
    placeholder: "Type here..",
})`
    width: 100%;
    margin: 0 auto;
    padding: 10px;
    font-family: "HelveticaNeueCyr", Arial, sans-serif;
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
    // align-self: flex-end;
    // margin-right: 5%;
    margin-left: auto;
    margin-top: 5px;
    font-family: "HelveticaNeueCyr", Arial, sans-serif;
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
    margin-bottom: 5px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.7);
`;

const MessageContent = styled.div`
    width: 80%;
    @media(max-width: 768px) {
        width: 400px;
    };
    @media(max-width: 550px) {
        width: 250px;
    };
    font-weight: 400;
    overflow: hidden;
    white-space: pre-wrap;
    color: #475466;
`;

const TimeStamp = styled.div`
    width: 50px;
    font-size: 12px;
`;

const LoaderWrapper = styled.div`
  display: flex; 
  justify-content: center; 
  align-items: center;
`;


type PropsType = {
    userMe: {
        me: UserType
    },
    setActive: (arg: any) => void,
    mobile: boolean
}

const ChatWindow: React.FC<PropsType> = ({ userMe, setActive, mobile }) => {

    const dispatch = useAppDispatch()

    const currentChat = useAppSelector(state => state.users.activeChat)

    const {
        data: messages,
        loading: msgLoading,
        error: msgError
    } = useQuery<IMessagesByRoomId>(MESSAGES_BY_ROOM, {
        variables: {
            roomId: currentChat.id,
            pageNum: 0,
            pageSize: 20
        }
    })

    useEffect(() => {
        if (messages?.messagesByRoomId) {
            dispatch(setMessages(messages.messagesByRoomId))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages])

    const AllMessages = useAppSelector(state => state.users.messages)

    const messagesEndRef = useRef(null)
    useEffect(() => {
        //@ts-ignore
        messagesEndRef.current?.scrollIntoView({
            behavior: 'smooth'
        })
    }, [AllMessages])

    let messagesContent

    if (msgLoading) {
        messagesContent =
            <LoaderWrapper>
                <BeatLoader color='gray' />
            </LoaderWrapper>
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
                                <TimeStamp>{new Date(msg.createdAt).toLocaleString('ru-RU')}</TimeStamp>
                            </MessageWrapper>
                        </MessageItem>
                    ))}
                    <span ref={messagesEndRef}></span>
                </MessagesList>
                : <div>There isn't messages yet</div>
    }

    const [text, setText] = useState('');

    const [sendMessage] = useMutation(SEND_MESSAGE_TO_ROOM, {
        variables: {
            message: {
                text,
                files: []
            },
            roomId: currentChat.id
        }
    })

    const handleSendMessage = () => {
        const newMessage = {
            id: 0,
            text,
            files: [],
            createdAt: new Date().toUTCString(),
            user: {
                id: userMe.me.id,
                email: userMe.me.email,
                firstname: userMe.me.firstname,
                lastname: userMe.me.lastname,
                googleImgUrl: userMe.me.googleImgUrl

            },
            room: currentChat
        };
        sendMessage()
        setText('')
        dispatch(setMessages({ ...newMessage, id: Date.now() }))
        const copyChat = Object.assign({}, currentChat)
        copyChat.lastMessage = newMessage
        dispatch(setRoom(copyChat))
    }

    return (
        <Window onClick={() => { mobile && setActive(false) }} active={Boolean(currentChat.id)}>
            <ChatContent>
                {messagesContent}
            </ChatContent>
            <TextWrapper>
                <div style={{width: '90%', display: 'flex', flexDirection: 'column'}}>
                    <TextArea value={text} onChange={evt => setText(evt.target.value)} whileFocus={{ height: 150 }} />
                    <SendButton disabled={!text} onClick={handleSendMessage}>Send</SendButton>
                </div>
            </TextWrapper>
        </Window>
    );
};

export default ChatWindow;