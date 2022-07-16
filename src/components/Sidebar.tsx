import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch } from '../hooks';
import { setActiveChat } from '../app/usersSlice';
import { IoSearchOutline, IoCloseOutline } from 'react-icons/io5';
import { useFetchUsersQuery, useFetchCommentsQuery } from '../api/apiSlice';

const Wrapper = styled.aside`
    position: relative;
    width: 22%;
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
    height: 80%;
    position: absolute;
    top: 120px;
    overflow: auto;

`;

const SearchWrapper = styled.div`
    position: relative;
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

const UserItem = styled.li<{ active: boolean }>`
    display: flex;
    align-items: center;
    padding: 15px 20px;
    background: ${props => props.active ? 'rgb(206, 237, 245)' : ''};
    :hover {
        background: rgba(206, 237, 245, 0.6);
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
    // const { users, comments } = useAppSelector(state => state.users)

    // useEffect(() => {
    //     dispatch(fetchUsers())
    //     dispatch(fetchComments())
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [])

    const {
        data: users,
        isLoading: isUsersLoading,
        isSuccess: isUsersSuccess,
        isError: isUsersError,
        error: usersError
    } = useFetchUsersQuery()

    const {
        data: comments,
    } = useFetchCommentsQuery()

    const [activeTab, setActiveTab] = useState(0)

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
                            {comments && comments.map(comment => (
                                <UserItem onClickCapture={() => setActiveTab(comment.id)} active={activeTab === comment.id} key={comment.id} onClick={() => { dispatch(setActiveChat(comment)) }}>
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
                            {users && users.map(user => (
                                <UserItem onClickCapture={() => setActiveTab(user.id)} active={activeTab === user.id} key={user.id} onClick={() => dispatch(setActiveChat(user))}>
                                    <Avatar />
                                    {user.name}
                                </UserItem>
                            ))}
                        </UsersList>
                    </TabContent>
                </>
            </SelectTab>
            <SearchWrapper>
                <Search value={searchValue} onChange={evt => setSearchValue(evt.target.value)} />
                {searchValue ?
                    <ClearIcon>
                        <IoCloseOutline onClick={() => setSearchValue('')} size="20px" />
                    </ClearIcon>
                    :
                    <SearchIcon>
                        <IoSearchOutline size="17px" />
                    </SearchIcon>}
            </SearchWrapper>
        </Wrapper>
    );
};

export default Sidebar;