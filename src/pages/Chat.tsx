import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Footer from '../components/UI/Footer';
import Main from '../components/Main';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import { Navigate } from 'react-router-dom';
import { Loader } from '../components/UI/Loader';
import { useQuery } from "@apollo/client";
import { USER_ME } from "../apollo/requests";
import Socket from '../app/Socket';
import { useAppSelector, useAppDispatch } from '../hooks';
import Header from '../components/Header';
import { setCurrentUser } from '../app/usersSlice';
import { UserMeType } from '../types';
import { useMatchMedia } from '../hooks/useMatchMedia';
import { BeatLoader } from 'react-spinners';

const Container = styled.div`
    height: 100vh;
    max-height: 100vh;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 8fr 1fr;
    grid-column-gap: 0px;
    grid-row-gap: 0px;
`;

const Wrapper = styled.section`
`;

const Welcome = styled.div`
    width: 100%;
    height: 100%;
    padding-top: 20%;
    font-size: 30px;
    text-align: center;
`;

const LoaderWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 40%;
`;

const Chat = () => {

    const currentChat = useAppSelector(state => state.users.activeChat)

    let clientRefWrapper = {
        clientRef: null
    }

    const dispatch = useAppDispatch()
    const { data: userMe, loading: isLoading, error: isError } = useQuery<UserMeType>(USER_ME)

    if (!isLoading) {
        dispatch(setCurrentUser(userMe?.me))
    }

    const [active, setActive] = useState(true)
    const [mobile, setMobile] = useState(false)

    //@ts-ignore
    const { isMobile } = useMatchMedia()


    useEffect(() => {
        if (isMobile) {
            setActive(false)
            setMobile(true)
        } else {
            setActive(true)
            setMobile(false)
        }
    }, [isMobile])

    let content

    if (isLoading) {
        content =
            isMobile ?
                <LoaderWrapper>
                    <BeatLoader />
                </LoaderWrapper>
                : <Loader />
    } else if (isError) {
        content = <Navigate to="/" />
    } else if (userMe) {
        content =
            <>
                <Container>
                    <Main>
                        <Sidebar mobile={mobile} active={active} setActive={setActive} />
                        <Wrapper>
                            <Header active={active} setActive={setActive} userMe={userMe} />
                            {currentChat.id ?
                                <ChatWindow mobile={mobile} setActive={setActive} userMe={userMe} />
                                :
                                <Welcome onClick={() => { mobile && setActive(false) }}>
                                    Welcome to Chatty
                                </Welcome>}
                        </Wrapper>
                    </Main>
                    <Footer />
                </Container>
                <Socket clientRefWrapper={clientRefWrapper} />
            </>
    }

    return (
        <>
            {content}
        </>
    )
};

export default Chat;