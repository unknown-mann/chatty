import React from 'react';
import styled from "styled-components";
import { motion } from 'framer-motion';
import { IoAdd } from 'react-icons/io5';
import { useMutation } from '@apollo/client';
import { ADD_NEW_FRIEND, FRIEND_REQUESTS } from '../apollo/requests';
import { IRequests } from '../types';

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
    width: 300px;
    margin-top: 65px;
    margin-right: 20px;
    font-family: Roboto, sans-serif;
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

const ModalTitle = styled.h2`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 10px;
    font-weight: 600;
    border-bottom: 1px solid #DADEE0;
`;

const ReqList = styled.ul`
    list-style-type: none;
`;

const ReqItem = styled.li`
`;

const Avatar = styled.img`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 10px;
`;

const ReqItemWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    :not(:last-child) {
        margin-bottom: 30px;
} 
`;

const Button = styled(motion.button)`
    width: 20px;
    height: 20px;
    background: none;
    border: none;
    cursor: pointer;
    :active {
        opacity: 0.6;
    }
`;

type PropsType = {
    reqData: IRequests,
    reqLoading: boolean,
    reqError: any,
    modalActive: boolean,
    setModalActive: (arg: boolean) => void,
}

const RequestsModal: React.FC<PropsType> = ({ reqData, reqLoading, reqError, modalActive, setModalActive }) => {

    const [addFriend, {loading}] = useMutation(ADD_NEW_FRIEND, {
        refetchQueries: [
            {query: FRIEND_REQUESTS},
            'FriendRequests'
        ]
    })

    const { friendRequests: requests = [] } = reqData

    return (
        <Modal onClick={() => setModalActive(false)}>
            <ModalContent
                initial={{ x: 150 }}
                animate={{ x: 0 }}
                onClick={(e) => e.stopPropagation()}>
                <ModalTitle>
                    Friend requests
                </ModalTitle>
                <ReqList>
                    {requests.length ? requests.map(user => (
                        <ReqItemWrapper>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Avatar src={user.googleImgUrl} />
                                <ReqItem key={user.id}>
                                    {user.firstname} {" "} {user.lastname}
                                </ReqItem>
                            </div>
                            <Button
                                disabled={loading}
                                onClick={() => addFriend({
                                    variables: {
                                        userId: user.id
                                    }
                                })}
                                whileHover={{ scale: 1.5 }}
                                transition={{ type: 'ease' }}>
                                <IoAdd size="20px" />
                            </Button>
                        </ReqItemWrapper>
                    )) : 'There are no new requests'}
                </ReqList>
            </ModalContent>
        </Modal>
    );
};

export default RequestsModal;