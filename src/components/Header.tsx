import React, { useState } from 'react';
import styled from 'styled-components';
import { IoPerson, IoLogOutOutline, IoPersonAdd } from "react-icons/io5"
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ACCESS_TOKEN } from '../constants';
import { useAppSelector } from '../hooks';
import ProfileModal from './ProfileModal';
import RequestsModal from './RequestsModal';
import { IRequests, UserType } from '../types';
import { useQuery } from '@apollo/client';
import { FRIEND_REQUESTS } from '../apollo/requests';

const Wrapper = styled.div`
    border-bottom: 1px solid #DADEE0;
`;

const HeaderEl = styled.header`
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
    right: -2px;
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
    width: 35px;
    height: 35px;
    border-radius: 50%;
`;

type PropsType = {
    userMe: {
        me: UserType
    }
}

const Header: React.FC<PropsType> = ({ userMe }) => {

    const [profileModalActive, setProfileModalActive] = useState(false)
    const [requestsModalActive, setRequestsModalActive] = useState(false)

    const navigate = useNavigate()

    const { setIsAuth } = useAuth();

    const logout = () => {
        setIsAuth(false);
        localStorage.removeItem(ACCESS_TOKEN)
        navigate('/')
    }

    const currentUser = useAppSelector(state => state.users.activeChat)

    const { data: reqData, loading: reqLoading, error: reqError } = useQuery<IRequests>(FRIEND_REQUESTS, {
        variables: {
            pageNum: 0,
            pageSize: 10
        }
    })

    const reqLength = reqData?.friendRequests.length

    return (
        <Wrapper>
            <HeaderEl>
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
            </HeaderEl>
            {profileModalActive &&
                <ProfileModal userMe={userMe} setModalActive={setProfileModalActive} />}
            {requestsModalActive && reqData &&
                <RequestsModal setModalActive={setRequestsModalActive} reqData={reqData} reqLoading={reqLoading} reqError={reqError} />}
        </Wrapper>
    );
};

export default Header;