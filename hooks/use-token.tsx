'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface TokenContextType {
    token: string | null;
    setToken: (token: string | null) => void;
    hasToken: boolean;
    clearToken: () => void;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

const TOKEN_STORAGE_KEY = 'login_token';

export const TokenProvider = ({ children }: { children: ReactNode }) => {
    const [token, setTokenState] = useState<string | null>(null);
    const [hasToken, setHasToken] = useState<boolean>(false);

    useEffect(() => {
        const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
        if (storedToken) {
            setTokenState(storedToken);
            setHasToken(true);
        }
    }, []);

    const setToken = (newToken: string | null) => {
        if (newToken) {
            localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
            setTokenState(newToken);
            setHasToken(true);
        } else {
            localStorage.removeItem(TOKEN_STORAGE_KEY);
            setTokenState(null);
            setHasToken(false);
        }
    };

    const clearToken = () => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setTokenState(null);
        setHasToken(false);
    };

    return (
        <TokenContext.Provider value={{ token, setToken, hasToken, clearToken }
        }>
            {children}
        </TokenContext.Provider>
    );
};

export const useToken = () => {
    const context = useContext(TokenContext);
    if (context === undefined) {
        throw new Error('useToken must be used within a TokenProvider');
    }
    return context;
};

export const getStoredToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(TOKEN_STORAGE_KEY);
    }
    return null;
};

export const setStoredToken = (token: string | null): void => {
    if (typeof window !== 'undefined') {
        if (token) {
            localStorage.setItem(TOKEN_STORAGE_KEY, token);
        } else {
            localStorage.removeItem(TOKEN_STORAGE_KEY);
        }
    }
};
export const clearStoredToken = (): void => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
}