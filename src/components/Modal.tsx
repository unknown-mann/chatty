import { motion } from 'framer-motion';
import React, { useState } from 'react';
import styled from 'styled-components';
import { ApolloError, ApolloQueryResult, OperationVariables, useMutation } from '@apollo/client';
import { ADD_NEW_FRIEND, FRIEND_REQUESTS, MY_FRIENDS } from '../apollo/requests';
import { IRequests } from '../types';
import { IoAdd } from 'react-icons/io5';
import { BeatLoader } from 'react-spinners';
import Users from './Users';
import { SiZeromq } from "react-icons/si"
import { useMatchMedia } from '../hooks/useMatchMedia';

const Modal = styled(motion.div)`
    z-index: 1;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled(motion.div)<{ismobile: boolean}>`
    width: ${props => props.ismobile ? '300px' : '400px'};
    height: ${props => props.ismobile ? '400px' : '500px'};
    margin-bottom: ${props => props.ismobile ? '200px' : ''};
    padding: 10px 0;
    font-size: 20px;
    border-radius: 10px;
    background-color: white;
`;

const SelectTab = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TabType = styled.span<{ active: boolean }>`
  position: relative;
  display: inline-block;
  width: 50%;
  padding: 15px;
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.active ? '#0b829e' : '#1ca1c1'};
  border-bottom: ${props => props.active ? '2px solid #0b829e' : ''};
  text-align: center;
  cursor: pointer;
`;

const List = styled.ul`
    height: 80%;
    font-size: 16px;
    font-weight: 400;
    color: #475466;
    list-style-type: none;
    overflow: auto;
`;

const ListItem = styled.li<{ isDisabled?: boolean }>`
    display: flex;
    align-items: center;
    padding: 15px 20px;
    opacity: ${props => props.isDisabled ? '0.5' : ''};
    :not(:last-child) {
        border-bottom: 1px solid #DADEE0;
    }
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 20px;
  border-radius: 50%;
`;

const Button = styled(motion.button)`
    width: 20px;
    height: 20px;
    margin-left: auto;
    background: none;
    border: none;
    cursor: pointer;
    :active {
        opacity: 0.6;
    }
`;

const LoaderWrapper = styled.div`
    height: 80%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const RequestsNum = styled.span<{ reqs: boolean, ismobile: boolean }>`
    position: absolute;
    top: 10px;
    right: ${props => props.ismobile ? '25px' : '48px'};
    width: 10px;
    height: 10px;
    font-size: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 1px;
    color: white;
    background: ${props => props.reqs ? 'green' : 'red'};
    border-radius: 50%;
`;

const Empty = styled.div`
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

type PropsType = {
    reqData: IRequests | undefined,
    reqLoading: boolean,
    reqError: ApolloError | undefined,
    refetchReq: (variables?: Partial<OperationVariables>) => Promise<ApolloQueryResult<IRequests>>,
    reqLength: number | undefined
    setModalActive: (arg: boolean) => void
}

const Friends: React.FC<PropsType> = ({ setModalActive, reqData, reqLoading, reqError, refetchReq, reqLength }) => {

    //@ts-ignore
    const { isMobile } = useMatchMedia()

    const [activeTab, setActiveTab] = useState(1)

    const toggleTab = (index: number) => setActiveTab(index)

    const [addFriend, { loading }] = useMutation(ADD_NEW_FRIEND, {
        refetchQueries: [
            { query: FRIEND_REQUESTS },
            { query: MY_FRIENDS },
            'FriendRequests',
            'MyFriends'
        ]
    })

    let requestsList

    if (reqLoading) {
        requestsList =
            <LoaderWrapper>
                <BeatLoader color="gray" />
            </LoaderWrapper>
    } else if (reqError) {
        requestsList = <div>{reqError.message}</div>
    } else if (reqData) {
        requestsList =
            reqData?.friendRequests.length ?
                reqData.friendRequests.map((req) => (
                    <ListItem isDisabled={loading} key={req.id}>
                        <Avatar src={req.googleImgUrl} />
                        {req.firstname} {req.lastname}
                        <Button
                            disabled={loading}
                            onClick={() => addFriend({
                                variables: {
                                    userId: req.id
                                }
                            })}
                            whileHover={{ scale: 1.3 }}
                            transition={{ type: 'ease' }}>
                            <IoAdd size="25px" />
                        </Button>
                    </ListItem>
                ))
                :
                <Empty>
                    <SiZeromq color="lightgray" size="100px" />
                </Empty>

    }

    return (
        <Modal onClick={() => setModalActive(false)}>
            <ModalContent
                ismobile={isMobile}
                onClick={(evt) => evt.stopPropagation()}>
                <SelectTab>
                    <TabType
                        active={activeTab === 1}
                        onClick={() => toggleTab(1)}
                    >
                        USERS
                    </TabType>
                    <TabType
                        active={activeTab === 2}
                        onClick={() => toggleTab(2)}
                    >
                        REQUESTS
                        {!reqLoading && <RequestsNum reqs={Boolean(reqLength)} ismobile={isMobile}>
                            {reqLength}
                        </RequestsNum>}
                    </TabType>
                </SelectTab>
                {activeTab === 1 ?
                    <>
                        <Users />
                    </>
                    :
                    <List>
                        {requestsList}
                    </List>
                }
            </ModalContent>
        </Modal>
    );
};

export default Friends;