import React, { useState } from "react";
import styled from "styled-components";
import { useAppDispatch } from "../hooks";
import { setActiveChat } from "../app/usersSlice";
import { IoSearchOutline, IoCloseOutline } from "react-icons/io5";
import { useQuery } from "@apollo/client";
import { MY_FRIENDS } from "../apollo/requests";
import { IFriends } from "../app/types";

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
  top: 120px;
  overflow: auto;
`;

const SearchWrapper = styled.div`
  position: relative;
`;

const Search = styled.input.attrs({
  type: "text",
  placeholder: "Search",
})`
  width: 90%;
  margin: 10px;
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
  right: 35px;
  color: #94a1b3;
`;

const SearchIcon = styled(Icon)`
  top: 21px;
`;

const ClearIcon = styled(Icon)`
  top: 19px;
  cursor: pointer;
`;

const UsersList = styled.ul`
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

const Sidebar = React.memo(() => {

  const [searchValue, setSearchValue] = useState("");

  const dispatch = useAppDispatch();

  const { data, loading } = useQuery<IFriends>(MY_FRIENDS);

  const myFriends = data?.myFriends

  const [activeTab, setActiveTab] = useState("");

  return (
    <Wrapper>
      <SelectTab>
        <>
          <TabButton value="chats" id="chats" />
          <TabType htmlFor="chats">Chats</TabType>
          <TabContent>
            <UsersList></UsersList>
          </TabContent>
        </>
        <>
          <TabButton value="users" id="users" defaultChecked />
          <TabType htmlFor="users">Users</TabType>
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
      <SearchWrapper>
        <Search
          value={searchValue}
          onChange={(evt) => setSearchValue(evt.target.value)}
        />
        {searchValue ? (
          <ClearIcon>
            <IoCloseOutline onClick={() => setSearchValue("")} size="20px" />
          </ClearIcon>
        ) : (
          <SearchIcon>
            <IoSearchOutline size="17px" />
          </SearchIcon>
        )}
      </SearchWrapper>
    </Wrapper>
  );
});

export default Sidebar;
