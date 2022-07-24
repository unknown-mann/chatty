export type StateType = {
    activeChat: UserType
    messages: IMessage[]
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

export interface IRoom {
    id: string
    userIds: string[]
    isMultiChat: boolean
}

export interface IMessage {
    id: string
    roomId: string
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

export interface IUsers {
    usersBySearch: UserType[]
}