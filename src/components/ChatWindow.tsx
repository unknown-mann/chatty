import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../hooks';
import { IoPerson, IoLogOutOutline, IoPersonAdd } from "react-icons/io5"
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProfileModal from './ProfileModal';
import { UserType } from '../app/types';
import SocketClass from './SocketClass';
import Socket from './SocketClass';
import RequestsModal from './RequestsModal';
import { useQuery } from '@apollo/client';
import { FRIEND_REQUESTS } from '../apollo/users'
import { ACCESS_TOKEN } from '../constants';
import { IRequest, IRequests } from '../app/types';


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
    userMe: UserType
}

const ChatWindow: React.FC<PropsType> = ({ userMe }) => {

    const navigate = useNavigate()

    const { setIsAuth } = useAuth();

    const logout = () => {
        setIsAuth(false);
        localStorage.removeItem(ACCESS_TOKEN)
        navigate('/')
    }

    const [profileModalActive, setProfileModalActive] = useState(false)
    const [requestsModalActive, setRequestsModalActive] = useState(false)

    const currentUser = useAppSelector(state => state.users.activeChat)

    const {
        loading: reqLoading,
        error: reqError,
        data: reqData
    } = useQuery<IRequests>(FRIEND_REQUESTS)

    const reqLength = reqData?.friendRequests.length

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
                    {/* <SocketClass/> */}
                    <Socket />
                </ChatContent>
                <TextWrapper>
                    <TextArea whileFocus={{ height: 150 }} />
                </TextWrapper>
            </Window>
            {profileModalActive && <ProfileModal userMe={userMe} modalActive={profileModalActive} setModalActive={setProfileModalActive} />}
            {requestsModalActive && reqData &&
                <RequestsModal
                    modalActive={requestsModalActive}
                    setModalActive={setRequestsModalActive}
                    reqData={reqData}
                    reqLoading={reqLoading}
                    reqError={reqError}
                />}
        </Wrapper>
    );
};

export default ChatWindow;