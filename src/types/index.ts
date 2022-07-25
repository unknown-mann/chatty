export type StateType = {
    activeChat: IRoom
    messages: IMessage[]
    currentUser: UserType
    rooms: IRoom[]
}

export type UserType = {
    id: string,
    email: string,
    firstname: string,
    lastname: string,
    googleImgUrl: string,
    friends?: UserType[]
}

export interface IRequest {
    id: string
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
    id: string
    email: string
    firstname: string
    lastname: string
    googleImgUrl: string
}

export interface IFriends {
    myFriends: IFriend[]
}

export interface IRooms {
    myRooms: IRoom[]
}

export interface IRoom {
    id: string
    users: UserType[]
    isMultiChat: boolean
    lastMessage?: IMessage
    unread: number
}

export interface IMessage {
    id: string
    room: IRoom
    text: string
    fileIds: string[]
    createdAt: string
    user: {
        id: string
        email: string
        firstname: string
        lastname: string
        googleImgUrl: string
    }
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