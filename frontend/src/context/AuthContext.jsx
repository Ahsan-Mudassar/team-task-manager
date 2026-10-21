import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { fetchMe, loginUser, logoutUser, registerUser } from '../api/auth.api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMe()
            .then(setUser)
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const login = useCallback(
        async (credentials) => setUser(
            await loginUser(credentials)
        ), []);

    const register = useCallback(
        async (data) => setUser(
            await registerUser(data)
        ), []);
        
    const logout = useCallback(
        async () => {
            await logoutUser();
            setUser(null);
        }, []);

    const value = useMemo(
        () => ({
            user,
            loading,
            login,
            register,
            logout
        }),
        [
            user,
            loading,
            login,
            register,
            logout
        ]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}