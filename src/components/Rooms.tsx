import React, { useState } from 'react';
import { BeatLoader } from 'react-spinners';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../hooks';
import { removeMessages, setCurrentChat, setRoom, setRooms } from "../app/usersSlice";
import { IRoom, IRooms } from '../types';
import { useMutation, useQuery } from '@apollo/client';
import { MY_ROOMS } from '../apollo/requests';
import { DELETE_ROOM } from '../apollo/requests';
import { IoCloseOutline } from 'react-icons/io5';
import { motion } from 'framer-motion';

const UsersList = styled.ul`
    margin-top: 10px;
    font-size: 14px;
    font-weight: 400;
    color: #475466;
`;

const FriendItem = styled.li<{ active: boolean }>`
    position: relative;
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
    margin-top: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
`;

const NumUnreadMsg = styled.div`
    width: 30px;
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
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

const Button = styled(motion.button)`
    position: absolute;
    top: 2px;
    right: 2px;
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
    mobile: boolean,
    setActive: (arg: boolean) => void
}

const Rooms: React.FC<PropsType> = ({ mobile, setActive }) => {

    const dispatch = useAppDispatch();

    const [activeChat, setActiveChat] = useState<number>();

    const currentUser = useAppSelector(state => state.users.currentUser)
    const myRooms = useAppSelector(state => state.users.rooms)

    const [deleteRoom] = useMutation(DELETE_ROOM, {
        onCompleted: data => {
            console.log(data)
        }
    })

    const handleDeleteRoom = (id: number) => async (evt: React.MouseEvent<HTMLButtonElement>) => {
        evt.stopPropagation()
        // eslint-disable-next-line no-restricted-globals
        const result = confirm('Clear chat?')
        if (result) {
            await deleteRoom({
                variables: {
                    roomId: id
                }
            })
            console.log('deleted')
        }
    }

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

    if (!roomsLoading && !myRooms?.length) {
        dispatch(setRooms(rooms?.myRooms))
    }

    const handleSetActiveRoom = (room: IRoom) => {
        dispatch(removeMessages())
        setActiveChat(room.id);
        dispatch(setCurrentChat(room))
        const newRoom = Object.assign({}, room)
        newRoom.unread = 0
        dispatch(setRoom(newRoom))
        if (mobile) {
            setActive(false)
        }
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
                            <div style={{ width: '100%', overflow: 'hidden' }}>
                                <div style={{ padding: '1px' }}>
                                    {getUserFirstname(room)} {getUserLastname(room)}
                                </div>
                                <UnreadMsg>
                                    {room.lastMessage && room.lastMessage.text}
                                </UnreadMsg>
                            </div>
                            <NumUnreadMsg>
                                {room.unread}
                            </NumUnreadMsg>
                            <Button
                                whileHover={{ scale: 1.3 }}
                                transition={{ type: 'ease' }}
                                onClick={handleDeleteRoom(room.id)}>
                                <IoCloseOutline size="20px" />
                            </Button>
                        </FriendItem>
                    ))}
                </UsersList>
                :
                <Empty>
                    No chats yet
                </Empty>
    }

    return (
        <>
            {roomsList}
        </>
    );
};

export default Rooms;