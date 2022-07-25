import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../hooks';
import { motion } from 'framer-motion';
import { UserType } from '../types';
import { useMutation, useQuery } from '@apollo/client';
import { MESSAGE_BY_USER, SEND_MESSAGE } from '../apollo/requests'
import { IMessagesByUserId } from '../types';
import { setMessages } from '../app/usersSlice';
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
    height: 91%;
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
const LoaderWrapper = styled.div`
  display: flex; 
  justify-content: center; 
  align-items: center;
`;


type PropsType = {
    userMe: {
        me: UserType
    },
    sendMessageBySocket: (arg: any) => void
}

const ChatWindow: React.FC<PropsType> = ({ userMe, sendMessageBySocket }) => {

    const currentUser = useAppSelector(state => state.users.activeChat)


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
                                <TimeStamp>{new Date(msg.createdAt).toLocaleString('en-GB')}</TimeStamp>
                            </MessageWrapper>
                        </MessageItem>
                    ))}
                    <span ref={messagesEndRef}></span>
                </MessagesList>
                : <div>There isn't messages yet</div>
    }

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
            id: Date.now().toString(),
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
        <Window active={Boolean(currentUser.id)}>
            <ChatContent>
                {messagesContent}
            </ChatContent>
            <TextWrapper>
                <TextArea value={text} onChange={evt => setText(evt.target.value)} whileFocus={{ height: 150 }} />
                <SendButton disabled={!text} onClick={handleSendMessage}>Send</SendButton>
            </TextWrapper>
        </Window>
    );
};

export default ChatWindow;