import { useMutation, useQuery } from '@apollo/client';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { BeatLoader } from 'react-spinners';
import styled from 'styled-components';
import { DELETE_FRIEND, MY_FRIENDS, ROOM } from '../apollo/requests';
import { IFriends, UserType } from '../types';
import { IoPersonRemoveOutline } from 'react-icons/io5';
import { useAppDispatch, useAppSelector } from '../hooks';
import { setCurrentChat } from '../app/usersSlice';
import { withApollo } from '@apollo/client/react/hoc';
import { setFriends } from '../app/usersSlice';


const UsersList = styled.ul`
  margin-top: 10px;
  font-size: 14px;
  font-weight: 400;
  color: #475466;
`;

const ListItem = styled.li<{ disabled: boolean, active: boolean, status: boolean }>`
    position: relative;
    display: flex;
    align-items: center;
    padding: 15px 20px;
    font-size: 16px;
    color: black;
    cursor: pointer;
    background: ${(props) => (props.active ? "rgb(206, 237, 245)" : "")};
    :hover {
        background: rgba(206, 237, 245, 0.6);
    };
    &:before {
        position: absolute;
        top: 45px;
        left: 50px;
        content: '';
        display: inline-block;
        width: 10px;
        height: 10px;
        border: 1px solid white;
        border-radius: 50%;
        background-color: ${props => props.status ? 'green' : 'red'};
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
    font-size: 20px;
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

    const myFriends = useAppSelector(state => state.users.friends)

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

    useEffect(() => {
        dispatch(setFriends(friends?.myFriends))
    }, [friends])

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
    } else if (myFriends) {
        friendsList =
            myFriends.length ?
                myFriends.map((friend) => (
                    <ListItem
                        key={friend.id}
                        onClick={() => { handleSetNewChat(friend); setActiveChat(friend.id) }}
                        disabled={deleteLoading}
                        active={activeChat === friend.id}
                        status={friend.online}
                    >
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
                    No friends yet
                </Empty>
    }

    return (
        <UsersList>
            {friendsList}
        </UsersList>
    );
};


export default withApollo(Friends);