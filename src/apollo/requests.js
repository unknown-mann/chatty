import { gql } from "@apollo/client";

export const FRIEND_REQUESTS = gql`
   query FriendRequests($pageNum: Int, $pageSize: Int) {
    friendRequests(pageNum: $pageNum, pageSize: $pageSize) {
        id
        email
        firstname
        lastname
        googleImgUrl
    }
}
`;

export const USER_ME = gql`
    query {
        me {
            id
            email
            firstname
            lastname
            googleImgUrl
        }
    }
`;

export const ADD_NEW_FRIEND = gql`
    mutation AddFriend($userId: ID) {
        addFriend(userId: $userId) {
            id
            email
            firstname
            lastname
        }
    }
`;

export const DELETE_FRIEND = gql`
    mutation DeleteFriend($userId: ID) {
        deleteFriend(userId: $userId) {
            id
            email
            firstname
            lastname
        }
    }
`;

export const MY_FRIENDS = gql`
    query MyFriends($pageNum: Int, $pageSize: Int) {
        myFriends(pageNum: $pageNum, pageSize: $pageSize) {
            id
            email
            firstname
            lastname
            googleImgUrl
        }
    }
`;

export const MESSAGE_BY_USER = gql`
    query MessagesByUserId($userId: String, $pageNum: Int, $pageSize: Int) {
        messagesByUserId(userId: $userId, pageNum: $pageNum, pageSize: $pageSize) {
            id
            roomId
            text
            fileIds
            createdAt
            user {
                id
                email
                firstname
                lastname
                googleImgUrl
            }
        }
    }
`;

export const ROOM = gql`
    query RoomByUserId($userId: String) {
        roomByUserId(userId: $userId) {
            id
            userIds
            isMultiChat
        }
    }
`;

export const SEND_MESSAGE = gql`
    mutation AddMessageToUser($message: MetaMessage, $userId: String ) {
        addMessageToUser(message: $message, userId: $userId) {
            id
            text
            user {
                id
                email
                firstname
                lastname
            }
        }
    }
`;

export const SEARCH_USER = gql`
    query UsersBySearch($search: String, $pageNum: Int, $pageSize: Int) {
        usersBySearch(search: $search, pageNum: $pageNum, pageSize: $pageSize) {
            id
            email
            firstname
            lastname
            googleImgUrl
        }
    }
`;
