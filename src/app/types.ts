export type UserType = {
    id: number,
    name: string
    body: string
}

export type CommentType = {
    id: number,
    name: string,
    body: string
    email: string
}

export type StateType = {
    activeChat: UserType
}