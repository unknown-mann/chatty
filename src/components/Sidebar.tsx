import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchComments, fetchUsers, setActiveChat } from '../app/usersSlice';
import { IoSearchOutline, IoCloseOutline } from 'react-icons/io5';

const Wrapper = styled.aside`
    position: relative;
    width: 25%;
    background-color: #f2f2f2;
    border-right: 1px solid #DADEE0;
`;

const SelectTab = styled.form`
    display: flex;
    justify-content: space-between;
`;

const TabButton = styled.input.attrs({
    type: 'radio',
    name: 'select'
})`
    display: none;
    :checked + label {
            color: #0b829e;
            border-bottom: 2px solid #0b829e;
    };
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
    color: #1CA1C1;
    text-align: center;
`;

const TabContent = styled.div`
    display: none;
    width: 100%;
    height: 75%;
    position: absolute;
    top: 120px;
    overflow: auto;

`;

const Search = styled.input.attrs({
    type: 'text',
    placeholder: "Search"
})`
    width: 90%;
    margin: 10px;
    padding: 10px;
    background-color: #f2f2f2;
    border: 1px solid #DADEE0;
    border-radius: 5px;
    :focus {
        outline: none !important;
        border-color: #1CA1C1;
        background-color: white;

    }
`;

const UsersList = styled.ul`
    font-size: 14px;
    font-weight: 400;
    color: #475466;
`;

const UserItem = styled.li`
    display: flex;
    align-items: center;
    padding: 15px 20px;
    :hover {
        background: #ceedf5;
    }
`;

const Avatar = styled.div`
    padding: 20px;
    margin-right: 20px;
    border-radius: 50%;
    background-color: aliceblue;
`;

const Sidebar = () => {

    const [searchValue, setSearchValue] = useState('')

    const dispatch = useAppDispatch()
    const { users, comments } = useAppSelector(state => state.users)

    useEffect(() => {
        dispatch(fetchUsers())
        dispatch(fetchComments())
    }, [])

    return (
        <Wrapper>
            <SelectTab>
                <>
                    <TabButton value="chats" id="chats" defaultChecked />
                    <TabType htmlFor="chats">
                        Chats
                    </TabType>
                    <TabContent>
                        <UsersList>
                            {comments.map(comment => (
                                <UserItem key={comment.id} onClick={() => { dispatch(setActiveChat(comment)) }}>
                                    <Avatar />
                                    {comment.email}
                                </UserItem>
                            ))}
                        </UsersList>
                    </TabContent>
                </>
                <>
                    <TabButton value="users" id="users" />
                    <TabType htmlFor="users">
                        Users
                    </TabType>
                    <TabContent>
                        <UsersList>
                            {users.map(user => (
                                <UserItem key={user.id} onClick={() => dispatch(setActiveChat(user))}>
                                    <Avatar />
                                    {user.name}
                                </UserItem>
                            ))}
                        </UsersList>
                    </TabContent>
                </>
            </SelectTab>
            <div style={{ position: 'relative' }}>
                <Search value={searchValue} onChange={evt => setSearchValue(evt.target.value)} />
                {searchValue ? <IoCloseOutline onClick={() => setSearchValue('')} size="20px" style={{ position: 'absolute', top: '19px', right: '25px', color: '#94a1b3', cursor: "pointer" }} /> : <IoSearchOutline size="17px" style={{ position: 'absolute', top: '21px', right: '25px', color: '#94a1b3' }} />}
            </div>
        </Wrapper>
    );
};

export default Sidebar;