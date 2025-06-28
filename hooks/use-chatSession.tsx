'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

const TOKEN_STORAGE_KEY = 'chat-session';


export const getChatSession = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(TOKEN_STORAGE_KEY);
    }
    return null;
};

export const setChatSession = (token: string | null): void => {
    if (typeof window !== 'undefined') {
        if (token) {
            localStorage.setItem(TOKEN_STORAGE_KEY, token);
        } else {
            localStorage.removeItem(TOKEN_STORAGE_KEY);
        }
    }
}; 