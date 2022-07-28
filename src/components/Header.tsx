import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../hooks';
import { IRequests, UserType } from '../types';
import { useQuery } from '@apollo/client';
import { FRIEND_REQUESTS } from '../apollo/requests';
import { FaUserFriends } from "react-icons/fa"
import { FiMoreVertical } from "react-icons/fi"
import ControlsMenu from './ControlsMenu';
import Modal from './Modal';
import { BASE_AVATAR } from '../constants';
import { FiMenu } from "react-icons/fi"

const Wrapper = styled.div`
    border-bottom: 1px solid #DADEE0;
`;

const HeaderEl = styled.header`
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 10px;
    font-weight: 500;
    color: #475466;
    font-size: 15px;
}
`;

const User = styled.div`
    font-size: 16px;
    font-weight: 400;
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

const ShowButton = styled(Button)`
    display: none;
    @media (max-width: 768px) {
        display: block;
    }
    margin-left: 0;
    margin-right: 15px;
`;

const RequestsNum = styled.span<{ reqs: boolean }>`
    position: absolute;
    top: 18px;
    right: 1px;
    width: 10px;
    height: 10px;
    font-size: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    background: ${props => props.reqs ? 'green' : 'red'};
    border-radius: 50%;
`;

const Avatar = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
`;

type PropsType = {
    userMe: {
        me: UserType
    },
    active: boolean,
    setActive: (arg: boolean) => void
}

const Header: React.FC<PropsType> = ({ userMe, active, setActive }) => {

    const [menuActive, setMenuActive] = useState(false)
    const [modalActive, setModalActive] = useState(false)

    const currentChat = useAppSelector(state => state.users.activeChat)
    const currentUser = useAppSelector(state => state.users.currentUser)

    const {
        data: reqData,
        loading: reqLoading,
        error: reqError,
        refetch: refetchReq
    } = useQuery<IRequests>(FRIEND_REQUESTS, {
        variables: {
            pageNum: 0,
            pageSize: 10
        },
        notifyOnNetworkStatusChange: true
    })

    const reqLength = reqData?.friendRequests.length

    const userAvatar = currentChat.users.find(user => user.id !== currentUser.id)?.googleImgUrl;
    const userName = currentChat.users.find(user => user.id !== currentUser.id)?.firstname;
    const userSurname = currentChat.users.find(user => user.id !== currentUser.id)?.lastname;

    return (
        <Wrapper>
            <HeaderEl>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {!active && <ShowButton onClick={() => setActive(!active)}>
                        <FiMenu size="20px" />
                    </ShowButton>}
                    <Avatar src={userAvatar || BASE_AVATAR} />
                </div>
                <User>
                    {userName} {' '} {userSurname}
                </User>
                <ButtonGroup>
                    <Button onClick={() => setModalActive(true)}>
                        {!reqLoading &&
                            <RequestsNum reqs={Boolean(reqLength)}>
                                {reqLength}
                            </RequestsNum>}
                        <FaUserFriends size="25px" />
                    </Button>
                    <Button onClick={() => setMenuActive(true)}>
                        <FiMoreVertical size="25px" />
                    </Button>
                </ButtonGroup>
            </HeaderEl>
            {menuActive && <ControlsMenu reqData={reqData} setMenuActive={setMenuActive} />}
            {modalActive && <Modal setModalActive={setModalActive} reqData={reqData} reqLoading={reqLoading} reqError={reqError} refetchReq={refetchReq} reqLength={reqLength} />}
        </Wrapper>
    );
};

export default Header;