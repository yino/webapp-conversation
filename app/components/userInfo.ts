import axios from 'axios';

export interface UserInfo {
  phone: string;
  invite_code: string;
  remaining_seconds: number;
  remaining_time_text: string; // 新增字段：格式化后时间字符串
  uuid: string;
}
const USER_UUID = `user_conversation_uuid`
const getLoginToken = (): string | null => {
  return localStorage.getItem('login_token');
};

// 格式化时间（内部私有函数）
const formatRemainingTime = (seconds: number): string => {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  let timeString = '';
  if (days > 0) {
    timeString += `${days}天 `;
  }
  if (hours > 0 || days > 0) {
    timeString += `${hours}小时 `;
  }
  if (minutes > 0 || hours > 0 || days > 0) {
    timeString += `${minutes}分钟 `;
  }
  // timeString += `${remainingSeconds}秒`;

  return timeString.trim();
};

export const fetchUserInfo = async (): Promise<UserInfo | null> => {
  const token = getLoginToken();
  if (!token) {
    console.error('未找到 login_token');
    return null;
  }

  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_SESSION_API_URL}/api/v1/auth/info`; // 使用环境变量拼接 URL
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data;

    if (data.code === 0 && data.data) {
      const rawData = data.data;
      const formatted: UserInfo = {
        phone: rawData.phone || '',
        invite_code: rawData.invite_code || '',
        remaining_seconds: rawData.remaining_seconds || 0,
        remaining_time_text: formatRemainingTime(rawData.remaining_seconds || 0),
        uuid: rawData.uuid || '',
      };
      setUUID(formatted.uuid)
      return formatted;
    } else {
      console.error('返回异常:', data);
      return null;
    }
  } catch (error) {
    console.error('请求失败:', error);
    return null;
  }
};

export const getUUID = (): string | null => {
  return localStorage.getItem(USER_UUID) || '';
};

const setUUID = (uuid: string): void => {
  localStorage.setItem(USER_UUID, uuid);
};