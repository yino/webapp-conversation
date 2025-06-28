// chat session 服务相关
// api 调用+store的存储
import { postSessionApi } from "./session_api";

// 绑定会话
export const bindChatSession = async (id: string) => {
    return postSessionApi(`conversation:sync`, { conversation_id: id })
}
