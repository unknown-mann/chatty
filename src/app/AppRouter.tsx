import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Chat from "../components/Chat";
import Login from "../components/Login";

export const AppRouter = () => {

    const { isAuth } = useAuth();

    return (
        isAuth
            ?
            <Routes>
                <Route path="/chat" element={<Chat />} />
                <Route path="*" element={<Chat />} />
            </Routes>
            :
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="*" element={<Login />} />
            </Routes>
    )
}