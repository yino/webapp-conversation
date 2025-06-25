import React, { useState, useEffect, useRef } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ChatBubbleOvalLeftEllipsisIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline'
import { ChatBubbleOvalLeftEllipsisIcon as ChatBubbleOvalLeftEllipsisSolidIcon } from '@heroicons/react/24/solid'
import Button from '@/app/components/base/button'
import type { ConversationItem } from '@/types/app'

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

const MAX_CONVERSATION_LENTH = 20

export type ISidebarProps = {
  copyRight: string
  currentId: string
  onCurrentIdChange: (id: string) => void
  list: ConversationItem[]
  onStartChat: (inputs: Record<string, any>) => void
  newConversationInputs: Record<string, any> | null
  hasSetInputs: boolean
  handleWelcomeChat: () => void
}

const Sidebar: FC<ISidebarProps> = ({
  copyRight,
  currentId,
  onCurrentIdChange,
  list,
  onStartChat,
  newConversationInputs,
  handleWelcomeChat,
}) => {
  const { t } = useTranslation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div
      className="shrink-0 flex flex-col overflow-y-auto chat-nav-bg pc:w-[244px] tablet:w-[192px] mobile:w-[240px] border-r border-gray-200 tablet:h-[calc(100vh_-_3rem)] mobile:h-screen"
    >
      <div className="flex justify-center items-center p-4 font-bold text-xl text-primary-900">
        <img
          src="/images/机器人.svg"
          alt="Logo"
          className="w-8 h-8 mr-2 mb-2"
        />
        ESG助手
      </div>
      {list.length < MAX_CONVERSATION_LENTH && (
        <div className="flex flex-shrink-0 p-4 !pb-0">
          <Button
            onClick={() => {
              onCurrentIdChange('-1');
              console.log("newConversationInputs", newConversationInputs)
              if (newConversationInputs) onStartChat(newConversationInputs);
              handleWelcomeChat();
            }}
            className="group block w-full flex-shrink-0 !justify-start !h-9 text-green-500 items-center text-sm bg-white pl-[4.7rem]">
            {t('app.chat.newChat')}
          </Button>
        </div>
      )}

      <nav className="mt-4 flex-1 space-y-1 chat-nav-bg p-4 !pt-0">
        {list.map((item) => {
          const isCurrent = item.id === currentId
          const ItemIcon
            = isCurrent ? ChatBubbleOvalLeftEllipsisSolidIcon : ChatBubbleOvalLeftEllipsisIcon
          return (
            <div
              onClick={() => onCurrentIdChange(item.id)}
              key={item.id}
              className={classNames(
                isCurrent
                  ? 'bg-green-100 text-green-600' // 选中时背景为浅绿色，文本为绿色
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-700', // 默认情况下文本为灰色，悬停时背景为浅灰色
                'group flex items-center rounded-md px-2 py-2 text-sm font-medium cursor-pointer',
              )}
            >
              {item.name}
            </div>
          )
        })}
      </nav>

      {/* 注释掉版权信息 */}
      {/* <div className="flex flex-shrink-0 pr-4 pb-4 pl-4">
        <div className="text-gray-400 font-normal text-xs">© {copyRight} {(new Date()).getFullYear()}</div>
      </div> */}

      <button
        onClick={toggleMenu}
        className="fixed bottom-16 left-10 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-600 rounded-full w-10 h-10 flex items-center justify-center shadow-sm border border-gray-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

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
            <span className="text-sm">退出账号</span>
          </div>
          <div className="menu-item py-1 border-b border-gray-100">
            <span className="text-sm">主题</span>
          </div>
          <div className="menu-item py-1">
            <span className="text-sm">关于我们</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default React.memo(Sidebar)
