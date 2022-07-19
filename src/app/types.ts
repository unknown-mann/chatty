export type StateType = {
    activeChat: UserType
}

export type UserType = {
    id: string,
    email: string,
    firstname: string,
    lastname: string,
    googleImgUrl: string,
    friendIds: string[],
    roles: string[]
}

export interface IRequest {
    id: string
    email: string
    firstname: string
    lastname: string
    googleImgUrl: string
    friendIds: string[]
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
    friendIds: string[]
}

export interface IFriends {
    myFriends: IFriend[]
}