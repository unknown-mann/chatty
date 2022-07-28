import { useLazyQuery, useMutation } from '@apollo/client';
import { motion } from 'framer-motion';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { IoCloseOutline, IoPersonAddOutline, IoSearchOutline } from 'react-icons/io5';
import { BeatLoader } from 'react-spinners';
import styled from 'styled-components';
import { ADD_NEW_FRIEND, SEARCH_USER } from '../apollo/requests';
import useDebounce from '../hooks/useDebounce';
import { IUsers } from '../types';

const LoaderWrapper = styled.div`
    height: 80%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const UsersList = styled.ul`
    height: 65%;
    font-size: 16px;
    font-weight: 400;
    color: #475466;
    list-style-type: none;
    overflow: auto;
`;

const UserItem = styled.li<{ isDisabled?: boolean }>`
    display: flex;
    align-items: center;
    padding: 15px 20px;
    opacity: ${props => props.isDisabled ? '0.5' : ''};
    :not(:last-child) {
        border-bottom: 1px solid #DADEE0;
    }
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

const NotFound = styled.div`
    padding: 20px;
`;

const SearchWrapper = styled.div`
  position: sticky;
  padding: 15px;
  padding-bottom: 10px;
`;

const Search = styled.input.attrs({
    type: "text",
    placeholder: "Type here...",
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

const Users: React.FC = () => {

    const [searchValue, setSearchValue] = useState("");
    const debouncedValue = useDebounce<string>(searchValue, 500)

    const handleSearch = (evt: ChangeEvent<HTMLInputElement>) => setSearchValue(evt.target.value)

    const [
        loadUsers,
        {
            data: users,
            loading: usersLoading,
            error: usersError
        }] = useLazyQuery<IUsers>(SEARCH_USER, {
            notifyOnNetworkStatusChange: true
        })

    const mounted = useRef<boolean>()

    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true
        } else {
            loadUsers({
                variables: {
                    search: searchValue,
                    pageNum: 0,
                    pageSize: 10
                },
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedValue])

    const [addFriend] = useMutation(ADD_NEW_FRIEND)

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
                            <UserItem
                                key={user.googleImgUrl}
                            >
                                <Avatar src={user.googleImgUrl} />
                                {user.firstname} {user.lastname}
                                <Button
                                    onClick={() => addFriend({
                                        variables: {
                                            userId: user.id
                                        }
                                    })}
                                    whileHover={{ scale: 1.2 }}
                                    transition={{ type: 'ease' }}
                                >
                                    <IoPersonAddOutline size="20px" />
                                </Button>
                            </UserItem>
                        ))}
                </UsersList>
                :
                <NotFound>No users found</NotFound>
    }
    return (
        <>
            <SearchWrapper>
                <Search
                    value={searchValue}
                    onChange={handleSearch}
                />
                {searchValue ? (
                    <ClearIcon>
                        <IoCloseOutline onClick={() => { setSearchValue("") }} size="20px" />
                    </ClearIcon>
                ) : (
                    <SearchIcon>
                        <IoSearchOutline size="17px" />
                    </SearchIcon>
                )}
            </SearchWrapper>
            {usersList}
        </>
    );
};

export default Users;