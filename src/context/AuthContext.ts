import { createContext } from 'react'

export type ContextType = {
    isAuth: boolean,
    setIsAuth: (auth: boolean) => void
}

export const AuthContext = createContext<ContextType>({
    isAuth: false,
    setIsAuth: () => {}
});
