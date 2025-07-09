// UsageTimeWarning.tsx
import React, { useEffect, useState } from 'react';
import { fetchUserInfo, UserInfo } from '@/app/components/userInfo';

interface UsageTimeWarningProps {
  servicePhone: string;
}

const UsageTimeWarning: React.FC<UsageTimeWarningProps> = ({ servicePhone }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  // 检查是否已经显示过警告
  const hasWarned = localStorage.getItem('hasWarned');

  useEffect(() => {
    const fetchAndCheckUserInfo = async () => {
      try {
        const info: UserInfo | null = await fetchUserInfo();
        if (info && info.remaining_seconds < 86400 && !hasWarned) {
          setRemainingTime(info.remaining_seconds);
          setIsVisible(true);
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    };

    fetchAndCheckUserInfo();
  }, [hasWarned]);

  const closeWarning = () => {
    setIsVisible(false);
    // 标记为已警告
    localStorage.setItem('hasWarned', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-full max-w-md bg-white rounded-xl p-8 mx-8 shadow-lg">
        <div className="text-left">
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            您的使用剩余已不足24小时，如需继续使用请联系我们，以免影响您的继续使用。
          </p>
          <p className="text-gray-600 mb-6">
            客服电话：<span className="text-green-500 font-medium">{servicePhone}</span>
          </p>
        </div>
        <div className="text-center mt-8">
          <button
            onClick={closeWarning}
            className="bg-transparent text-green-500 font-medium py-2 px-4 rounded-full"
          >
            我已知晓
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsageTimeWarning;
