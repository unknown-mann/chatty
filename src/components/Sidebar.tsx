import React, { ChangeEvent, useState } from "react";
import styled from "styled-components";
import { useAppDispatch } from "../hooks";
import { setCurrentChat } from "../app/usersSlice";
import { IoSearchOutline, IoCloseOutline } from "react-icons/io5";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { ADD_NEW_FRIEND, MY_FRIENDS, SEARCH_USER } from "../apollo/requests";
import { IFriends, IUsers } from "../types";
import { IoAdd } from 'react-icons/io5';
import { BeatLoader } from "react-spinners";

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
  :hover {
    background: rgba(206, 237, 245, 0.6);
  }
`;

const FriendItem = styled(UserItem)<{ active?: boolean }>`
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

const Sidebar = React.memo(() => {

  const [searchValue, setSearchValue] = useState("");

  const dispatch = useAppDispatch();

  const { data: friends, loading: friendsLoading, error: friendsError } = useQuery<IFriends>(MY_FRIENDS, {
    variables: {
      pageNum: 0,
      pageSize: 10
    }
  });

  const [activeChat, setActiveChat] = useState("");

  const [loadUsers, { data: users, loading: usersLoading, error: usersError, refetch }] = useLazyQuery<IUsers>(SEARCH_USER, {
    variables: {
      search: '',
      pageNum: 0,
      pageSize: 10
    }
  })

  const handleSearch = (evt: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(evt.target.value)
    refetch({
      search: searchValue,
      pageNum: 0,
      pageSize: 10
    })
  }

  const [addFriend] = useMutation(ADD_NEW_FRIEND, {
    onCompleted: (data) => {
      console.log(data)
    }
  })

  let friendsList

  if (friendsLoading) {
    friendsList = 
      <LoaderWrapper>
        <BeatLoader color="gray" />
      </LoaderWrapper>
  } else if (friendsError) {
    friendsList = friendsError.message
  } else if (friends?.myFriends) {
    friendsList =
      <UsersList>
        {friends.myFriends.map((friend) => (
          <FriendItem
            key={friend.id}
            onClick={() => { setActiveChat(friend.id); dispatch(setCurrentChat(friend)) }}
            active={activeChat === friend.id}
          >
            <Avatar src={friend.googleImgUrl} />
            {friend.firstname} {friend.lastname}
          </FriendItem>
        ))}
      </UsersList>
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
      <UsersList>
        {!usersLoading && users &&
          users.usersBySearch.map(user => (
            <UserItem key={user.googleImgUrl}>
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
  }

  const toggleTab = (index: number) => [
    setActiveTab(index)
  ]

  const [activeTab, setActiveTab] = useState(2)

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
            {friendsList}
          </TabContent>
        </>
      </SelectTab>
    </Wrapper>
  );
});

export default Sidebar;
