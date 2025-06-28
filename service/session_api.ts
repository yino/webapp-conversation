// session api相关
import axios from 'axios';
import { SESSION_API_PREFIX, SESSION_API } from '@/config'
import { getStoredToken, clearStoredToken } from '@/hooks/use-token';
import Toast from '@/app/components/base/toast'

// 拼接完整 URL
const buildFullUrl = (url: string) => {
    return `${SESSION_API}${SESSION_API_PREFIX}/${url}`;
};

// GET 请求示例
export const getSessionApi = async (url: string, params?: Record<string, any>) => {
    try {
        const fullUrl = buildFullUrl(url);
        const userToken = getStoredToken();
        const response = await axios.get(fullUrl, {
            params,
            headers: {
                Authorization: `Bearer ${userToken}`
            }
        });
        if (response.data?.code === 401) {
            console.error('未登录，请重新登录');
            window.location.href = '/';
        }
        return response.data;
    } catch (error) {
        console.error('GET 请求失败:', error);
        throw error;
    }
};

// POST 请求示例，使用 JSON 格式
export const postSessionApi = async (url: string, data?: Record<string, any>) => {
    try {
        const fullUrl = buildFullUrl(url);
        const userToken = getStoredToken();
        if (!userToken) {
            return;
        }
        const response = await axios.post(fullUrl, data, {
            headers: {
                Authorization: `Bearer ${userToken}`
            }
        });
        return response.data;
    } catch (error) {
        // 处理 401 错误
        if (error.response?.data?.code === 401) {
            clearStoredToken();
            Toast.notify({ type: 'error', message: 'Invalid token' });
            // 跳转至登录页
            setTimeout(() => {
                window.location.href = '/';
            }, 500);
        }
        throw error;
    }
};