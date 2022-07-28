import { gql } from "@apollo/client";

export const USER_ME = gql`
    query {
        me {
            id
            email
            firstname
            lastname
            googleImgUrl
            online
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

export const MESSAGE_BY_USER = gql`
    query MessagesByUserId($userId: Int, $pageNum: Int, $pageSize: Int) {
        messagesByUserId(userId: $userId, pageNum: $pageNum, pageSize: $pageSize) {
            id
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

export const ADD_NEW_FRIEND = gql`
    mutation AddFriend($userId: Int) {
        addFriend(userId: $userId) {
            id
            email
            firstname
            lastname
        }
    }
`;

export const DELETE_FRIEND = gql`
    mutation DeleteFriend($userId: Int) {
        deleteFriend(userId: $userId) {
            id
            email
            firstname
            lastname
        }
    }
`;

export const SEND_MESSAGE = gql`
    mutation AddMessageToUser($message: MetaMessage, $userId: Int ) {
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


export const ROOM = gql`
    query RoomByUserId($userId: Int) {
        roomByUserId(userId: $userId) {
            id
            users {
                id
                email
                firstname
                lastname
            }
            isMultiChat
        }
    }
`;

export const MY_ROOMS = gql`
    query MyRooms($pageNum: Int, $pageSize: Int) {
        myRooms(pageNum: $pageNum, pageSize: $pageSize) {
            id
            users {
                id
                email
                firstname
                lastname
                googleImgUrl
            }
            isMultiChat
            lastMessage {
                id
                text
                createdAt
            }
            unread
        }
    }
`;

export const MESSAGES_BY_ROOM = gql`
    query MessagesByRoomId($roomId: Int, $pageNum: Int, $pageSize: Int) {
        messagesByRoomId(roomId: $roomId, pageNum: $pageNum, pageSize: $pageSize) {
            id
            text
            createdAt
            user {
                id
                email
                firstname
                lastname
                googleImgUrl
            }
            reads {
                id
                email
                firstname
                lastname
                googleImgUrl
            }
        }
    }
`;

export const SEND_MESSAGE_TO_ROOM = gql`
    mutation AddMessageToRoom($message: MetaMessage, $roomId: Int) {
        addMessageToRoom(message: $message, roomId: $roomId) {
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

export const SET_READ = gql`
    mutation SetRead($roomId: Int) {
        setRead(roomId: $roomId)
    }
`;

export const ROOM_BY_ID = gql`
    query RoomById($roomId: Int) {
        roomById(roomId: $roomId) {
            id
            users {
                id
                email
                firstname
                lastname
                googleImgUrl
            }
            isMultiChat
            lastMessage {
                id
                text
                createdAt
            }
            unread
        }
    }
`;