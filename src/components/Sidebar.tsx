import React, { ChangeEvent, useEffect, useState } from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setCurrentChat, setRooms } from "../app/usersSlice";
import { IoSearchOutline, IoCloseOutline } from "react-icons/io5";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { ADD_NEW_FRIEND, DELETE_FRIEND, MESSAGE_BY_USER, MY_ROOMS, ROOM, SEARCH_USER } from "../apollo/requests";
import { IRooms, IUsers } from "../types";
import { IoAdd, IoClose } from 'react-icons/io5';
import { BeatLoader } from "react-spinners";
import useDebounce from "../hooks/useDebounce";
import { withApollo } from '@apollo/client/react/hoc';

const Wrapper = styled.aside`
  position: relative;
  width: 22%;
  background-color: #f2f2f2;
  border-right: 1px solid #dadee0;
`;

const SelectTab = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TabType = styled.span<{ active: boolean }>`
  display: inline-block;
  width: 50%;
  padding: 20px;
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.active ? '#0b829e' : '#1ca1c1'};
  border-bottom: ${props => props.active ? '2px solid #0b829e' : ''};
  text-align: center;
  cursor: pointer;
`;

const TabContent = styled.div<{ active: boolean }>`
  display: ${props => props.active ? 'block' : 'none'};
  width: 100%;
  height: 80%;
  position: absolute;
  top: 60px;
  overflow: auto;
`;

const SearchWrapper = styled.div`
  position: relative;
  padding: 15px;
  padding-bottom: 0;
`;

const Search = styled.input.attrs({
  type: "text",
  placeholder: "Search",
})`
  width: 100%;
  padding: 10px;
  font-size: 14px;
  background-color: #f2f2f2;
  border: 1px solid #dadee0;
  border-radius: 5px;
  :focus {
    outline: none !important;
    border-color: #1ca1c1;
    background-color: white;
  }
`;

const Icon = styled.span`
  position: absolute;
  right: 30px;
  color: #94a1b3;
`;

const SearchIcon = styled(Icon)`
  top: 25px;
`;

const ClearIcon = styled(Icon)`
  top: 24px;
  cursor: pointer;
`;

const UsersList = styled.ul`
  margin-top: 10px;
  font-size: 14px;
  font-weight: 400;
  color: #475466;
`;

const UserItem = styled.li`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  cursor: pointer;
  :hover {
    background: rgba(206, 237, 245, 0.6);
  }
`;

const FriendItem = styled(UserItem) <{ active?: boolean }>`
  background: ${(props) => (props.active ? "rgb(206, 237, 245)" : "")};
`;

const Avatar = styled.img`
  width: 35px;
  height: 35px;
  margin-right: 20px;
  border-radius: 50%;
`;

const Button = styled.button`
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
  height: 100%; 
  display: flex; 
  justify-content: center; 
  margin-top: 100px;
`;

const NotFound = styled.div`
    padding: 20px;
`;

const Sidebar: React.FC<any> = React.memo(({ client }) => {

  const currentUser = useAppSelector(state => state.users.currentUser)
  const myRooms = useAppSelector(state => state.users.rooms)

  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = useState(2)

  const toggleTab = (index: number) => setActiveTab(index)

  const [searchValue, setSearchValue] = useState("");
  const debouncedValue = useDebounce<string>(searchValue, 500)

  const [loadUsers, { data: users, loading: usersLoading, error: usersError, refetch }] = useLazyQuery<IUsers>(SEARCH_USER, {
    variables: {
      search: '',
      pageNum: 0,
      pageSize: 10
    },
    notifyOnNetworkStatusChange: true
  })

  const handleSearch = (evt: ChangeEvent<HTMLInputElement>) => setSearchValue(evt.target.value)

  useEffect(() => {
    refetch({
      search: searchValue,
      pageNum: 0,
      pageSize: 10
    })
  }, [debouncedValue])

  const { data: rooms, loading: roomsLoading, error: roomsError, refetch: refetchRooms } = useQuery<IRooms>(MY_ROOMS, {
    variables: {
      pageNum: 0,
      pageSize: 10
    }
  });

  if (!roomsLoading && !myRooms.length) {
    dispatch(setRooms(rooms?.myRooms))
  }


  const [activeChat, setActiveChat] = useState("");

  const [addFriend] = useMutation(ADD_NEW_FRIEND)

  const [deleteFriend] = useMutation(DELETE_FRIEND)

  const handleDelete = async (id: string | undefined) => {
    // eslint-disable-next-line no-restricted-globals
    const result = confirm('Delete friend?')
    if (result) {
      await deleteFriend({
        variables: {
          userId: id
        },
        onCompleted: (data) => console.log(data)
      })
      refetchRooms({
        pageNum: 0,
        pageSize: 10
      })
    }
  }

  let roomsList

  if (roomsLoading) {
    roomsList =
      <LoaderWrapper>
        <BeatLoader color="gray" />
      </LoaderWrapper>
  } else if (roomsError) {
    roomsList = roomsError.message
  } else if (rooms?.myRooms) {
    rooms.myRooms.length ?
      roomsList =
      <UsersList>
        {rooms.myRooms.map((room) => (
          <FriendItem
            key={room.id}
            onClick={() => { setActiveChat(room.id); dispatch(setCurrentChat(room)) }}
            active={activeChat === room.id}
          >
            <Avatar src={room.users.find(user => {
              return user.id !== currentUser.id
            })?.googleImgUrl} />
            {room.users.find(user => user.id !== currentUser.id)?.firstname} {room.users.find(user => user.id !== currentUser.id)?.lastname}
            <br />
            {room.lastMessage && room.lastMessage.text}
            <br />
            {room.unread}
            <Button onClick={() => handleDelete(room.users.find(user => user.id !== currentUser.id)?.id)}>
              <IoClose size="20px" />
            </Button>
          </FriendItem>
        ))}
      </UsersList>
      :
      <NotFound>No active chats</NotFound>
  }

  let usersList

  if (usersLoading) {
    usersList =
      <LoaderWrapper>
        <BeatLoader color="gray" />
      </LoaderWrapper>
  } else if (usersError) {
    usersList = <div>{usersError.message}</div>
  } else if (users?.usersBySearch) {
    usersList =
      users.usersBySearch.length ?
        <UsersList>
          {!usersLoading && users &&
            users.usersBySearch.map(user => (
              <UserItem onClick={async () => {
                const { data } = await client.query({
                  query: ROOM,
                  variables: { userId: user.id }
                });
                dispatch(setCurrentChat(data.roomByUserId))
              }} key={user.googleImgUrl}>
                <Avatar src={user.googleImgUrl} />
                {user.firstname} {user.lastname}
                <Button
                  onClick={() => addFriend({
                    variables: {
                      userId: user.id
                    }
                  })}
                >
                  <IoAdd size="20px" />
                </Button>
              </UserItem>
            ))}
        </UsersList>
        :
        <NotFound>No users found</NotFound>
  }

  return (
    <Wrapper>
      <SelectTab>
        <>
          <TabType active={activeTab === 1} onClick={() => { toggleTab(1); loadUsers() }}>Users</TabType>
          <TabContent active={activeTab === 1}>
            <SearchWrapper>
              <Search
                value={searchValue}
                onChange={handleSearch}
              />
              {searchValue ? (
                <ClearIcon>
                  <IoCloseOutline onClick={() => { setSearchValue(""); refetch({ search: '', pageNum: 0, pageSize: 10 }) }} size="20px" />
                </ClearIcon>
              ) : (
                <SearchIcon>
                  <IoSearchOutline size="17px" />
                </SearchIcon>
              )}
            </SearchWrapper>
            {activeTab === 1 && usersList}
          </TabContent>
        </>
        <>
          <TabType active={activeTab === 2} onClick={() => toggleTab(2)}>Chats</TabType>
          <TabContent active={activeTab === 2}>
            {roomsList}
          </TabContent>
        </>
      </SelectTab>
    </Wrapper>
  );
});

export default withApollo(Sidebar);
