import { gql } from "@apollo/client";

export const FRIEND_REQUESTS = gql`
   query {
    friendRequests(pageNum: 0, pageSize: 10) {
        id
        email
        firstname
        lastname
        googleImgUrl
        friendIds
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
            friendIds
        }
    }
`;

export const ADD_NEW_FRIEND = gql`
    mutation {
        addFriend(userId: string) {
            id
            email
            firstname
            lastname
            friendIds
        }
    }
`;

export const MY_FRIENDS = gql`
    query {
        myFriends(pageNum: 0, pageSize: 10) {
            id
            email
            firstname
            lastname
            googleImgUrl
            friendIds
        }
    }
`;

export const MESSAGE_BY_USER = gql`
    query {
        messagesByUserId(userId: String, pageNum: Int, pageSize: Int) {
            id
            senderId
            roomId
            text
        }
    }
`;

export const ROOM = gql`
    query {
        roomByUserId(userId: String) {
            id
            userIds
            isMultiChat
        }
    }
`;