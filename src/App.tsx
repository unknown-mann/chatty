import React, { useEffect, useState } from 'react';
import { AuthContext, ContextType } from "./context/AuthContext";
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './app/AppRouter';
import { ACCESS_TOKEN } from './constants';


export const App = () => {

  const [isAuth, setIsAuth] = useState(false);

  const context: ContextType = {
    isAuth,
    setIsAuth
  }

  useEffect(() => {
    if (localStorage.getItem(ACCESS_TOKEN)) {
      setIsAuth(true)
    }
  }, [])

  return (
    <AuthContext.Provider value={context}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
