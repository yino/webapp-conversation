import React, { useState, useEffect, useRef } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ChatBubbleOvalLeftEllipsisIcon,
} from '@heroicons/react/24/outline'
import { ChatBubbleOvalLeftEllipsisIcon as ChatBubbleOvalLeftEllipsisSolidIcon } from '@heroicons/react/24/solid'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import Button from '@/app/components/base/button'
import type { ConversationItem } from '@/types/app'

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

const MAX_CONVERSATION_LENTH = 20

export type ISidebarProps = {
  isMobile?: boolean;
  copyRight: string
  currentId: string
  onCurrentIdChange: (id: string) => void
  list: ConversationItem[]
  onStartChat: (inputs: Record<string, any>) => void
  newConversationInputs: Record<string, any> | null
  hasSetInputs: boolean
  handleWelcomeChat: () => void
  onShowSettings: () => void; // 新增的回调函数
}

const Sidebar: FC<ISidebarProps> = ({
  isMobile,
  copyRight,
  currentId,
  onCurrentIdChange,
  list,
  onStartChat,
  newConversationInputs,
  handleWelcomeChat,
  onShowSettings, // 新增的回调函数
}) => {
  const { t } = useTranslation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false) // 新增状态
  const menuRef = useRef<HTMLDivElement>(null)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleHidden = () => {
    setHidden(!hidden)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    setShowLogoutConfirm(true) // 显示退出确认对话框
  }

  const confirmLogout = () => {
    // 清除 login_token 缓存
    localStorage.removeItem('login_token') 
    // 关闭确认对话框
    setShowLogoutConfirm(false)
    window.location.href = process.env.NEXT_PUBLIC_LOGIN_URL|| '/web';
    // 可以在这里添加跳转到登录页面等逻辑
  }

  const cancelLogout = () => {
    setShowLogoutConfirm(false) // 关闭确认对话框
  }

  if (hidden) {
    return (
      <div
        className="fixed top-22 left-4 z-50 hidden md:flex items-center justify-center w-10 h-10 bg-white border border-gray-300 rounded-md shadow cursor-pointer
        transition-transform duration-300 hover:scale-110 hover:bg-gray-100"
        onClick={toggleHidden}
        aria-label={t('app.sidebar.expand')}
        title={t('app.sidebar.expand')}
      >
        <img
          src="/images/menu2.svg"
          alt="Logo"
          className="w-5 h-5 "
        />
      </div>
    )
  }

  return (
    <div
      className="shrink-0 flex flex-col overflow-y-auto chat-nav-bg pc:w-[244px] tablet:w-[192px] mobile:w-[240px] border-r border-gray-200 tablet:h-[calc(100vh_-_3rem)] mobile:h-screen relative
      transition-all duration-300 ease-in-out"
    >
      {/* 顶部 Logo 和标题 */}
      {!isMobile ? (
        <div className="flex justify-between items-center p-4 font-bold text-xl text-primary-900">
          <div className="flex items-center ml-5">
            <img
              src="/images/robot.svg"
              alt="Logo"
              className="w-8 h-8 mr-2 mb-1"
            />
            ESG助手
          </div>

          {/* 隐藏按钮 */}
          <button
            onClick={toggleHidden}
            className="text-gray-500 hover:text-gray-700 hidden md:flex items-center justify-center w-10 h-10 rounded-md
            transition-transform duration-300 hover:scale-110"
            aria-label={t('app.sidebar.collapse')}
            title={t('app.sidebar.collapse')}
          >
            <img
              src="/images/menu.svg"
              alt="Logo"
              className="w-5 h-5 mr-2 mb-1"
            />
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-center p-4 font-bold text-xl text-primary-900">
          <div className="flex items-center ml-5">
            历史对话
          </div>
        </div>
      )}
      
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

      {/* 对话列表 */}
      <nav className="mt-4 flex-1 space-y-1 chat-nav-bg p-4 !pt-0">
        {list.map((item) => {
          const isCurrent = item.id === currentId
          const ItemIcon = isCurrent ? ChatBubbleOvalLeftEllipsisSolidIcon : ChatBubbleOvalLeftEllipsisIcon
          return (
            <div
              onClick={() => onCurrentIdChange(item.id)}
              key={item.id}
              className={classNames(
                isCurrent
                  ? 'bg-green-100 text-green-600'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-700',
                'group flex items-center rounded-md px-2 py-2 text-sm font-medium cursor-pointer',
              )}
            >
              {item.name}
            </div>
          )
        })}
      </nav>

      {/* 底部区域 */}
      {!isMobile ? (
        // PC 端底部菜单按钮
        <button
          onClick={toggleMenu}
          className="fixed bottom-16 left-10 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-600 rounded-full w-10 h-10 flex items-center justify-center shadow-sm border border-gray-300"
          aria-label={t('app.sidebar.menu')}
          title={t('app.sidebar.menu')}
        >
          <img
            src="/images/setup.svg"
            alt="Logo"
            className="w-5 h-5"
          />
        </button>
      ) : (
        // 移动端用户信息栏 - 添加点击事件
        <div 
          className="flex items-center justify-between bg-gray-100 p-3 rounded-lg cursor-pointer"
          onClick={onShowSettings} // 添加点击事件
        >
          <div className="text-green-500 text-base font-normal">158****1234</div>
          <div className="text-green-500 ">></div>
        </div>
      )}

      {/* 菜单内容 */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="fixed bottom-32 left-10 bg-white rounded-xl shadow-lg w-48 p-2"
        >
          <div className="menu-item flex justify-between items-center py-1 border-b border-gray-100">
            <span className="text-sm">手机号码</span>
            <span className="text-sm">15890501234</span>
          </div>
          <div className="menu-item flex justify-between items-center py-1 border-b border-gray-100">
            <span className="text-sm">邀请码</span>
            <span className="text-sm">12345678</span>
          </div>
          <div className="menu-item flex justify-between items-center py-1 border-b border-gray-100">
            <span className="text-sm">剩余时间</span>
            <span className="text-sm text-green-500">3天12小时</span>
          </div>
          <div className="menu-item flex justify-between items-center py-1 border-b border-gray-100">
            <span className="text-sm">联系我们</span>
            <span className="text-sm">0571-123124</span>
          </div>
          <div className="menu-item py-1 border-b border-gray-100">
            <span
              className="text-sm cursor-pointer hover:text-red-500"
              onClick={handleLogout} // 添加点击事件
            >
              退出账号
            </span>
          </div>
          <div className="menu-item py-1 border-b border-gray-100">
            <span className="text-sm cursor-pointer hover:text-gray-700">主题</span>
          </div>
          <div className="menu-item py-1">
            <span className="text-sm cursor-pointer hover:text-gray-700">关于我们</span>
          </div>
        </div>
      )}

      {/* 退出确认对话框 */}
    {showLogoutConfirm && (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl transform transition-all duration-300 scale-95 animate-fade-in-up">
          <div className="text-center mb-6">
            
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">确认退出账号？</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-300">您的账户将保持安全，下次需要重新登录</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              className="px-6 py-3 flex-1 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
              onClick={cancelLogout}
            >
              取消
            </button>
            <button
              className="px-6 py-3 flex-1 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-red-300 flex items-center justify-center"
              onClick={confirmLogout}
            >
              确认退出
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
  )
}

export default React.memo(Sidebar)
