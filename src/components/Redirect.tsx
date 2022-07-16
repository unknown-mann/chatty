import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Redirect = () => {

    function getUrlParameter(name: any) {
        name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');

        var results = regex.exec(window.location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    const token = getUrlParameter('token');

    const { setIsAuth } = useAuth();

    if (token) {
        localStorage.setItem('accessToken', token);
        setIsAuth(true)
        return <Navigate to="/chat" />
    } else {
        return <Navigate to="/" />;
    }
};

export default Redirect;