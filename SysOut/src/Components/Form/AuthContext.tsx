import { createContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextProps {
    isAuthenticated: boolean;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    username: string | null;
    setUsername: (username: string | null) => void;
    token: string | null; // Added token property
    setToken: (token: string | null) => void; // Added setToken property
}

export const AuthContext = createContext<AuthContextProps>({
    isAuthenticated: false,
    setIsAuthenticated: () => {},
    username: null,
    setUsername: () => {},
    token: null, // Added default value for token
    setToken: () => {}, // Added default value for setToken
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => JSON.parse(localStorage.getItem('isAuthenticated') || 'false'));
    const [username, setUsername] = useState<string | null>(() => localStorage.getItem('username'));
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('token')); // Added token state

    useEffect(() => {
        localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
        localStorage.setItem('username', username || '');
        localStorage.setItem('token', token || ''); // Added token storage
    }, [isAuthenticated, username, token]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, username, setUsername, token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;