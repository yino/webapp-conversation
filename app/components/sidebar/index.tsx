import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ChatBubbleOvalLeftEllipsisIcon,
} from '@heroicons/react/24/outline';
import { ChatBubbleOvalLeftEllipsisIcon as ChatBubbleOvalLeftEllipsisSolidIcon } from '@heroicons/react/24/solid';
import Button from '@/app/components/base/button';
import { privacyPolicy, serviceAgreement } from '@/app/components/sidebar/policies.js';
import { fetchUserInfo, UserInfo } from '@/app/components/userInfo.ts';

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

const MAX_CONVERSATION_LENTH = 20;

export type ISidebarProps = {
  isMobile?: boolean;
  copyRight: string;
  currentId: string;
  onCurrentIdChange: (id: string) => void;
  list: any[];
  onStartChat: (inputs: Record<string, any>) => void;
  newConversationInputs: Record<string, any> | null;
  hasSetInputs: boolean;
  handleWelcomeChat: () => void;
  onShowSettings: () => void;
};

const Sidebar: React.FC<ISidebarProps> = ({
  isMobile,
  copyRight,
  currentId,
  onCurrentIdChange,
  list,
  onStartChat,
  newConversationInputs,
  handleWelcomeChat,
  onShowSettings,
}) => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  useEffect(() => {
    document.addEventListener('mousedown', (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    });

    return () => {
      document.removeEventListener('mousedown', () => {});
    };
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const info = await fetchUserInfo();
      if (info) setUserInfo(info);
    };
    getUser();
  }, []);
// 格式化手机号
const formatPhone = (phone: string): string => {
  // 保留手机号前 3 位和后 2 位，中间用星号替换
  return phone.replace(/(\d{3})\d{4}(\d{2})/, '$1*****$2');
};
  const confirmLogout = () => {
    localStorage.removeItem('login_token');
    window.location.href = process.env.NEXT_PUBLIC_LOGIN_URL || '/web';
  };

  return (
    <div className="shrink-0 flex flex-col overflow-y-auto chat-nav-bg pc:w-[244px] tablet:w-[192px] mobile:w-[240px] border-r border-gray-200 tablet:h-[calc(100vh_-_3rem)] mobile:h-screen relative transition-all duration-300 ease-in-out">
      <div className="flex justify-between items-center p-4 font-bold text-xl text-primary-900">
        <div className="flex items-center ml-1 text-sm">
          <img src="/images/robot.svg" alt="Logo" className="w-8 h-8 mr-1 mb-1" />
          MandLab AI Agent
        </div>
      </div>

      {!isMobile && list.length < MAX_CONVERSATION_LENTH && (
        <div className="flex flex-shrink-0 p-4 !pb-0">
          <Button
            onClick={() => {
              onCurrentIdChange('-1');
              if (newConversationInputs) onStartChat(newConversationInputs);
              handleWelcomeChat();
            }}
            className="group block w-full flex-shrink-0 !justify-start !h-9 text-green-500 items-center text-sm bg-white pl-[4.7rem]"
          >
            {t('app.chat.newChat')}
          </Button>
        </div>
      )}

      <nav className="mt-4 flex-1 space-y-1 chat-nav-bg p-4 !pt-0">
        {list.map((item) => (
          <div
            onClick={() => onCurrentIdChange(item.id)}
            key={item.id}
            className={classNames(
              item.id === currentId ? 'bg-green-100 text-green-600' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-700',
              'group flex items-center rounded-md px-2 py-2 text-sm font-medium cursor-pointer'
            )}
          >
            {item.name}
          </div>
        ))}
      </nav>

       {!isMobile ? (
        <button
          onClick={toggleMenu}
          className="fixed bottom-16 left-10 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-600 rounded-full w-10 h-10 flex items-center justify-center shadow-sm border border-gray-300"
          aria-label={t('app.sidebar.menu')}
          title={t('app.sidebar.menu')}
        >
          <img src="/images/setup.svg" alt="Logo" className="w-5 h-5" />
        </button>
      ) : (
        <div
          className="flex items-center justify-between bg-gray-100 p-3 rounded-lg cursor-pointer"
          onClick={onShowSettings}
        >
         <div className="text-green-500 text-base font-normal">
  {userInfo?.phone ? formatPhone(userInfo.phone) : '无'}
</div>
          <div className="text-green-500">></div>
        </div>
      )}


      {isMenuOpen && (
        <div ref={menuRef} className="fixed bottom-32 left-10 bg-white rounded-xl shadow-lg w-48 p-2">
          <div className="menu-item flex justify-between items-center py-1 border-b border-gray-100">
            <span className="text-sm">手机号码</span>
            <span className="text-sm">{userInfo?.phone || '无'}</span>
          </div>
          <div className="menu-item flex justify-between items-center py-1 border-b border-gray-100">
            <span className="text-sm">邀请码</span>
            <span className="text-sm">{userInfo?.invite_code || '无'}</span>
          </div>
          <div className="menu-item flex justify-between items-center py-1 border-b border-gray-100">
            <span className="text-sm">剩余时间</span>
            <span className="text-sm text-green-500">{userInfo?.remaining_time_text || '无'}</span>
          </div>
          <div className="menu-item py-1 border-b border-gray-100">
            <span
              className="text-sm cursor-pointer hover:text-red-500"
              onClick={confirmLogout}
            >退出账号</span>
          </div>
          <div className="menu-item py-1 border-b border-gray-100">
            <span
              className="text-sm cursor-pointer hover:text-red-500"
              onClick={() => {
                setModalTitle('服务协议');
                setModalContent(serviceAgreement);
                setIsModalVisible(true);
              }}
            >服务协议</span>
          </div>
          <div className="menu-item py-1 border-b border-gray-100">
            <span
              className="text-sm cursor-pointer hover:text-red-500"
              onClick={() => {
                setModalTitle('隐私政策');
                setModalContent(privacyPolicy);
                setIsModalVisible(true);
              }}
            >隐私政策</span>
          </div>
        </div>
      )}

      {isModalVisible && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl overflow-hidden">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{modalTitle}</h3>
            </div>
            <div className="max-h-[60vh] overflow-y-auto whitespace-pre-line text-gray-500 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: modalContent }} />
            <div className="mt-6 text-right">
              <button
                className="px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={() => setIsModalVisible(false)}
              >关闭</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(Sidebar);
