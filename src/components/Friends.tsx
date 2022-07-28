import { useMutation, useQuery } from '@apollo/client';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { BeatLoader } from 'react-spinners';
import styled from 'styled-components';
import { DELETE_FRIEND, MY_FRIENDS, ROOM } from '../apollo/requests';
import { IFriends, UserType } from '../types';
import { IoPersonRemoveOutline } from 'react-icons/io5';
import { useAppDispatch } from '../hooks';
import { setCurrentChat } from '../app/usersSlice';
import { withApollo } from '@apollo/client/react/hoc';
import { SiZeromq } from "react-icons/si"


const UsersList = styled.ul`
  margin-top: 10px;
  font-size: 14px;
  font-weight: 400;
  color: #475466;
`;

const ListItem = styled.li<{ isDisabled: boolean, active: boolean }>`
    display: flex;
    align-items: center;
    padding: 15px 20px;
    font-size: 16px;
    color: black;
    cursor: pointer;
    background: ${(props) => (props.active ? "rgb(206, 237, 245)" : "")};
    :hover {
    background: rgba(206, 237, 245, 0.6);
}
`;

const LoaderWrapper = styled.div`
    height: 100%; 
    display: flex; 
    justify-content: center; 
    margin-top: 100px;
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

const Empty = styled.div`
    margin-top: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Friends: React.FC<any> = ({ client }) => {

    const dispatch = useAppDispatch();

    const [activeChat, setActiveChat] = useState<number>();

    const handleSetNewChat = async (user: UserType) => {
        const { data } = await client.query({
            query: ROOM,
            variables: { userId: user.id }
        });
        dispatch(setCurrentChat(data.roomByUserId))
    }

    const {
        data: friends,
        loading: friendsLoading,
        error: friendsError,
        refetch: refetchFriends
    } = useQuery<IFriends>(MY_FRIENDS, {
        variables: {
            pageNum: 0,
            pageSize: 10
        },
        notifyOnNetworkStatusChange: true
    })

    const [deleteFriend, { loading: deleteLoading }] = useMutation(DELETE_FRIEND)

    const handleDelete = async (id: number | undefined) => {
        // eslint-disable-next-line no-restricted-globals
        const result = confirm('Delete friend?')
        if (result) {
            await deleteFriend({
                variables: {
                    userId: id
                }
            });
            refetchFriends({
                pageNum: 0,
                pageSize: 10
            })
        }
    }

    let friendsList

    if (friendsLoading) {
        friendsList =
            <LoaderWrapper>
                <BeatLoader color="gray" />
            </LoaderWrapper>
    } else if (friendsError) {
        friendsList = <div>{friendsError.message}</div>
    } else if (friends) {
        friendsList =
            friends?.myFriends.length ?
                friends.myFriends.map((friend) => (
                    <ListItem
                        onClick={() => { handleSetNewChat(friend); setActiveChat(friend.id) }}
                        isDisabled={deleteLoading}
                        active={activeChat === friend.id}
                        key={friend.id}>
                        <Avatar src={friend.googleImgUrl} />
                        {friend.firstname} {friend.lastname}
                        <Button
                            onClick={() => handleDelete(friend.id)}
                            whileHover={{ scale: 1.3 }}
                            transition={{ type: 'ease' }}>
                            <IoPersonRemoveOutline size="20px" />
                        </Button>
                    </ListItem>
                ))
                :
                <Empty>
                    <SiZeromq color="lightgray" size="100px"/>
                </Empty>
    }

    return (
        <UsersList>
            {friendsList}
        </UsersList>
    );
};


export default withApollo(Friends);