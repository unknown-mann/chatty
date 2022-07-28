import React, { useState } from 'react';
import { BeatLoader } from 'react-spinners';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../hooks';
import { setCurrentChat, setRoom, setRooms } from "../app/usersSlice";
import { IRoom, IRooms } from '../types';
import { useQuery } from '@apollo/client';
import { MY_ROOMS } from '../apollo/requests';
import { SiZeromq } from 'react-icons/si';

const UsersList = styled.ul`
    margin-top: 10px;
    font-size: 14px;
    font-weight: 400;
    color: #475466;
`;

const FriendItem = styled.li<{ active: boolean }>`
    display: flex;
    align-items: center;
    padding: 15px 20px;
    font-size: 16px;
    color: black;
    background: ${(props) => (props.active ? "rgb(206, 237, 245)" : "")};
    :hover {
        background: rgba(206, 237, 245, 0.6);
    }
`;

const Avatar = styled.img`
    width: 40px;
    height: 40px;
    margin-right: 20px;
    border-radius: 50%;
`;

const LoaderWrapper = styled.div`
    height: 100%; 
    display: flex; 
    justify-content: center; 
    margin-top: 100px;
`;

const Empty = styled.div`
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const NumUnreadMsg = styled.div`
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: auto;
    padding-top: 1px;
    font-size: 12px;
    background-color: #c5d0db;
    border-radius: 50%;
`;

const UnreadMsg = styled.div`
    margin-top: 5px;
    color: #475466;
    font-size: 15px;
`;

const Rooms = () => {

    const dispatch = useAppDispatch();

    const [activeChat, setActiveChat] = useState<number>();

    const currentUser = useAppSelector(state => state.users.currentUser)
    const myRooms = useAppSelector(state => state.users.rooms)

    const {
        data: rooms,
        loading: roomsLoading,
        error: roomsError,
        refetch: refetchRooms
    } = useQuery<IRooms>(MY_ROOMS, {
        variables: {
            pageNum: 0,
            pageSize: 10
        }
    });

    if (!roomsLoading && !myRooms.length) {
        dispatch(setRooms(rooms?.myRooms))
    }

    const handleSetActiveRoom = (room: IRoom) => {
        setActiveChat(room.id);
        dispatch(setCurrentChat(room))
        const newRoom = Object.assign({}, room)
        newRoom.unread = 0
        dispatch(setRoom(newRoom))
    }

    const getUserAvatar = (room: IRoom) => room.users.find(user => user.id !== currentUser.id)?.googleImgUrl
    const getUserFirstname = (room: IRoom) => room.users.find(user => user.id !== currentUser.id)?.firstname
    const getUserLastname = (room: IRoom) => room.users.find(user => user.id !== currentUser.id)?.lastname

    let roomsList

    if (roomsLoading) {
        roomsList =
            <LoaderWrapper>
                <BeatLoader color="gray" />
            </LoaderWrapper>
    } else if (roomsError) {
        roomsList = <div>{roomsError.message}</div>
    } else if (myRooms) {
        roomsList =
            myRooms.length ?
                <UsersList>
                    {myRooms.map((room) => (
                        <FriendItem
                            key={room.id}
                            onClick={() => handleSetActiveRoom(room)}
                            active={activeChat === room.id}
                        >
                            <Avatar src={getUserAvatar(room)} />
                            <div>
                                {getUserFirstname(room)} {getUserLastname(room)}
                                <UnreadMsg>
                                    {room.lastMessage && room.lastMessage.text}
                                </UnreadMsg>
                            </div>
                            <NumUnreadMsg>
                                {room.unread}
                            </NumUnreadMsg>
                        </FriendItem>
                    ))}
                </UsersList>
                :
                <Empty>
                    <SiZeromq color="lightgray" size="100px" />
                </Empty>
    }

    return (
        <>
            {roomsList}
        </>
    );
};

export default Rooms;