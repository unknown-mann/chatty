import React from 'react';
import styled from "styled-components";
import { motion } from 'framer-motion';
import { UserType } from '../types';
import { ApolloError } from '@apollo/client';
import { BeatLoader } from 'react-spinners';
import { useMatchMedia } from '../hooks/useMatchMedia';

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
    padding: 25px;
    border-radius: 10px;
    box-shadow: 0 0 10px 3px rgba(221, 221, 221, 1);
    overflow: auto;
    background-color: white;
`;

const Avatar = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
`;

const ModalTitle = styled.h2`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 10px;
    font-weight: 600;
    border-bottom: 1px solid #DADEE0;
`;

const ModalField = styled.p`
    :not(:last-child) {
        margin-bottom: 15px;
    }   
`;

type PropsType = {
    userMe: {
        me: UserType
    },
    loading: boolean,
    error: ApolloError | undefined
}

const ProfileModal: React.FC<PropsType> = ({ userMe, loading, error }) => {

    //@ts-ignore
    const {isMobile} = useMatchMedia()

    const {
        firstname,
        lastname,
        email,
        googleImgUrl
    } = userMe.me;

    let content

    if (loading) {
        content = <BeatLoader color="gray" />
    } else if (error) {
        content = <div>{error.message}</div>
    } else if (userMe.me) {
        content =
            <>
                <ModalTitle>
                    My profile
                    <Avatar src={googleImgUrl} />
                </ModalTitle>
                <ModalField>
                    Name: {firstname}
                </ModalField>
                <ModalField>
                    Surname: {lastname}
                </ModalField>
                <ModalField>
                    E-mail: {email}
                </ModalField>
            </>
    }

    return (
        <Modal>
            <ModalContent
                initial={{ x: 150 }}
                animate={isMobile ? { x: -100 } : { x: -170 }}
                onClick={(e) => e.stopPropagation()}>
                {content}
            </ModalContent>
        </Modal>
    );
};

export default ProfileModal;