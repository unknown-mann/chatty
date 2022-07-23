import React, { ChangeEvent, useState } from "react";
import styled from "styled-components";
import { useAppDispatch } from "../hooks";
import { setActiveChat } from "../app/usersSlice";
import { IoSearchOutline, IoCloseOutline } from "react-icons/io5";
import { useQuery, useMutation } from "@apollo/client";
import { ADD_NEW_FRIEND, MY_FRIENDS, SEARCH_USER } from "../apollo/requests";
import { IFriends, IUsers } from "../types";
import { IoAdd } from 'react-icons/io5';

const Wrapper = styled.aside`
  position: relative;
  width: 22%;
  background-color: #f2f2f2;
  border-right: 1px solid #dadee0;
`;

const SelectTab = styled.form`
  display: flex;
  justify-content: space-between;
`;

const TabButton = styled.input.attrs({
  type: "radio",
  name: "select",
})`
  display: none;
  :checked + label {
    color: #0b829e;
    border-bottom: 2px solid #0b829e;
  }
  :checked + label + div {
    display: block;
  }
`;

const TabType = styled.label`
  display: inline-block;
  width: 50%;
  padding: 20px;
  font-size: 16px;
  font-weight: 500;
  color: #1ca1c1;
  text-align: center;
`;

const TabContent = styled.div`
  display: none;
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

const UserItem = styled.li<{ active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background: ${(props) => (props.active ? "rgb(206, 237, 245)" : "")};
  :hover {
    background: rgba(206, 237, 245, 0.6);
  }
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

const Sidebar = React.memo(() => {

  const [searchValue, setSearchValue] = useState("");

  const dispatch = useAppDispatch();

  const { data, loading } = useQuery<IFriends>(MY_FRIENDS);

  const myFriends = data?.myFriends

  const [activeTab, setActiveTab] = useState("");

  const { data: users, loading: usersLoading, refetch } = useQuery<IUsers>(SEARCH_USER, {
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

  const [addFriend] = useMutation(ADD_NEW_FRIEND)

  return (
    <Wrapper>
      <SelectTab>
        <>
          <TabButton value="users" id="users" />
          <TabType htmlFor="users">Users</TabType>
          <TabContent>
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
            <UsersList>
              {!usersLoading && users &&
                users.usersBySearch.map(user => (
                  <UserItem key={user.id}>
                    <Avatar src={user.googleImgUrl} />
                    {user.firstname} {user.lastname}
                    <Button
                      disabled
                      onClick={() => addFriend({
                        variables: {
                          userId: user.id
                        }})}
                    >
                      <IoAdd size="20px" />
                    </Button>
                  </UserItem>
                ))
              }
            </UsersList>
          </TabContent>
        </>
        <>
          <TabButton defaultChecked value="chats" id="chats" />
          <TabType htmlFor="chats">Chats</TabType>
          <TabContent>
            <UsersList>
              {!loading && myFriends &&
                myFriends.map((friend) => (
                  <UserItem
                    onClickCapture={() => setActiveTab(friend.id)}
                    active={activeTab === friend.id}
                    key={friend.id}
                    onClick={() => dispatch(setActiveChat(friend))}
                  >
                    <Avatar src={friend.googleImgUrl} />
                    {friend.firstname} {friend.lastname}
                  </UserItem>
                ))}
            </UsersList>
          </TabContent>
        </>
      </SelectTab>
    </Wrapper>
  );
});

export default Sidebar;
