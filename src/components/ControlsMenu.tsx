import { useQuery } from '@apollo/client';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { IoLogOutOutline, IoPerson } from 'react-icons/io5';
import styled from 'styled-components';
import { USER_ME } from '../apollo/requests';
import { IRequests } from '../types';
import ProfileModal from './ProfileModal';
import { ACCESS_TOKEN } from '../constants';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Modal = styled.div`
    z-index: 1;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: flex-end;
    align-items: start;
`;

const ModalContent = styled(motion.div)`
    margin-top: 65px;
    margin-right: 20px;
    color: #475466;
    font-size: 16px;
    font-weight: 400;
    line-height: 1.2rem;
    padding: 25 0px;
    border-radius: 10px;
    box-shadow: 0 0 10px 3px rgba(221, 221, 221, 1);
    overflow: auto;
    background-color: white;
`;

const List = styled.ul`
    list-style-type: none;
`;

const ListItem = styled(motion.li)`
    display: flex;
    align-items: center;
    padding: 20px 30px;
    border-bottom: 1px solid #DADEE0;
    :hover {
        background-color: lightgray;
    }
`;

const Text = styled.div`
    margin-left: 10px;
`;

type PropsType = {
    reqData: IRequests | undefined,
    setMenuActive: (arg: boolean) => void
}

const ControlsMenu: React.FC<PropsType> = ({ setMenuActive }) => {

    const navigate = useNavigate()

    const { setIsAuth } = useAuth();

    const logout = () => {
        setIsAuth(false);
        localStorage.removeItem(ACCESS_TOKEN)
        navigate('/')
    }

    const { data: userMe, loading, error } = useQuery(USER_ME)

    const [profileModalActive, setProfileModalActive] = useState(false)

    return (
        <Modal onClick={() => setMenuActive(false)}>
            <ModalContent
                initial={{ x: 150 }}
                animate={{ x: 0 }}
                onClick={(e) => e.stopPropagation()}>
                <List>
                    <ListItem onClick={() => setProfileModalActive(!profileModalActive)}>
                        <IoPerson size="20px" />
                        <Text>My profile</Text>
                        {profileModalActive &&
                            <ProfileModal userMe={userMe} loading={loading} error={error} />}
                    </ListItem>
                    <ListItem onClick={() => logout()}>
                        <IoLogOutOutline size="25px" />
                        <Text>Log out</Text>
                    </ListItem>
                </List>
            </ModalContent>
        </Modal>
    );
};

export default ControlsMenu;