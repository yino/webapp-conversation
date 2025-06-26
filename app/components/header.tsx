import type { FC } from 'react'
import React from 'react'
import { Bars3Icon, PencilSquareIcon } from '@heroicons/react/24/solid'
import AppIcon from '@/app/components/base/app-icon'

export type IHeaderProps = {
  title: string
  isMobile?: boolean
  onShowSideBar?: () => void
  onCreateNewChat?: () => void
}

const Header: FC<IHeaderProps> = ({
  title,
  isMobile,
  onShowSideBar,
  onCreateNewChat,
}) => {
  return (
    <div className="shrink-0 flex items-center justify-between h-12 px-3 bg-green-50 chat-nav-bg">
      {/* 左侧菜单图标 */}
      {isMobile ? (
        <div
          className="flex items-center justify-center h-10 w-10 cursor-pointer rounded-full hover:bg-green-100"
          onClick={() => onShowSideBar?.()}
        >
          <Bars3Icon className="h-5 w-5 text-green-700" />
        </div>
      ) : (
        <div></div>
      )}

      {/* 中间标题部分 */}
      {isMobile ? (
        <div className="flex items-center space-x-2">

          <div className="text-sm text-green-800 font-bold">ESG助手-mandlab</div>

          <div className="text-sm text-green-600 font-bold">ESG助手-mandlab</div>
        </div>
      ) : (
        <div></div>
      )}

      {/* 右侧创建新对话图标 */}
      {isMobile ? (
        <div
          className="flex items-center justify-center h-10 w-10 cursor-pointer rounded-full hover:bg-green-100"
          onClick={() => onCreateNewChat?.()}
        >
          <PencilSquareIcon className="h-5 w-5 text-green-700" />
        </div>
      ) : (
        <div></div>
      )}
    </div>
  )
}

export default React.memo(Header)
