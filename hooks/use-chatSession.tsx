'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

const TOKEN_STORAGE_KEY = 'chat-session-id:';

// 记录服务端已经保存过得
export const isFirstChatSession = (id: string): string | boolean => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(TOKEN_STORAGE_KEY + id) === "1";
    }
    return false;
};

export const saveFristChatSession = (id: string | null): void => {
    if (typeof window !== 'undefined' && id) {
        localStorage.setItem(TOKEN_STORAGE_KEY + id, "1");
    }
};