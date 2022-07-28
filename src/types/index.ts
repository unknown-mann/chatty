export type StateType = {
    activeChat: IRoom
    messages: IMessage[]
    currentUser: UserType
    rooms: IRoom[],
    usersBySearch: UserType[],
    friends: UserType[]
}

export type UserType = {
    id: number,
    email: string,
    firstname: string,
    lastname: string,
    googleImgUrl: string,
    online: boolean,
    friends?: UserType[]
}

export type UserMeType = {
    me: UserType
}

export interface IRequest {
    id: number
    email: string
    firstname: string
    lastname: string
    googleImgUrl: string
    friendIds: string[]
    roles: string[]
}

export interface IRequests {
    friendRequests: IRequest[]
}

export interface IFriend {
    id: number
    email: string
    firstname: string
    lastname: string
    googleImgUrl: string
    online: boolean
}

export interface IFriends {
    myFriends: IFriend[]
}

export interface IRooms {
    myRooms: IRoom[]
}

export interface IRoom {
    id: number
    users: UserType[]
    isMultiChat: boolean
    lastMessage?: IMessage
    unread: number
}

export interface IMessage {
    id: number
    room: IRoom
    text: string
    files: MessageFile[] | undefined
    createdAt: string
    user: {
        id: number
        email: string
        firstname: string
        lastname: string
        googleImgUrl: string
    }
}

export interface MessageFile {
    id: number
    googleFileId: string
    contentType: string
    fileName: string
    senderId: string
    status: string
    fileType: string
}

export interface IMessagesByUserId {
    messagesByUserId: IMessage[];
}

export interface IMessagesByRoomId {
    messagesByRoomId: IMessage[];
}

export interface IUsers {
    usersBySearch: UserType[]
}