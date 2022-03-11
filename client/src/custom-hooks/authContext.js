import React from 'react';

const AuthContext = React.createContext({
    user: null,
    setUser: () => { }
});

export const useAuth = () => React.useContext(AuthContext);

export default AuthContext;
