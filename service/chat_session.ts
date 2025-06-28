// chat session 服务相关
// api 调用+store的存储
import { postSessionApi, getSessionApi } from "./session_api";

// 绑定会话
export const bindChatSession = async (id: string, title: string) => {
    return postSessionApi(`conversation:sync`, { conversation_id: id, title: title })
}

// 获取会话列表
export const getSessionList = async () => {
    return await getSessionApi(`conversation`, {})
}

// 查询对话
export const getChatSession = async (id: string) => {
    return getSessionApi(`conversation`, {})
}

// 处理数据 为了贴合easygf的格式
export const afterGetSessionList = (resp: Promise<any>) => {
    if (resp?.error) {
        throw new Error(resp?.error)
    }
    let result: any[] = []
    // 遍历resp.data
    for (let item of resp?.data || []) {
        result.push({
            id: item.conversation_id,
            name: item.title,
            created_at: item?.created_at || 0,
            inputs: item?.inputs || {},
            introduction: "",
            status: "normal",
            updated_at: item?.updated_at || 0,
        })
    }
    return {
        limit: 100,
        has_more: false,
        data: result,
    };
}