import type { FC } from 'react';
import React, { useState } from 'react';
import { Bars3Icon, PencilSquareIcon } from '@heroicons/react/24/solid';
import AppIcon from '@/app/components/base/app-icon';
import Toast from '@/app/components/base/toast';
import { useTranslation } from 'react-i18next'

const { notify } = Toast

export type IHeaderProps = {
  title: string;
  isMobile?: boolean;
  onShowSideBar?: () => void;
  onCreateNewChat?: () => void;
  onStartChat: (inputs: Record<string, any>) => void;
  onCurrentIdChange: (id: string) => void;
  newConversationInputs: Record<string, any> | null;
  hasSetInputs: boolean;
  handleWelcomeChat: () => void;
  isResponding?: boolean;
};

const Header: FC<IHeaderProps> = ({
  title,
  isMobile,
  onShowSideBar,
  handleWelcomeChat,
  onCreateNewChat,
  onCurrentIdChange,
  onStartChat,
  newConversationInputs,
  isResponding,
}) => {
  const { t } = useTranslation()
  const handleClick = () => {
    onCurrentIdChange('-1');
    if (newConversationInputs) onStartChat(newConversationInputs);
    handleWelcomeChat();
  };

  return (
    <div className="shrink-0 flex items-center justify-between h-12 px-3 bg-green-50 chat-nav-bg">
      {/* 左侧菜单图标 */}
      {isMobile ? (
        <div
          className="flex items-center justify-center h-10 w-10 cursor-pointer rounded-full hover:bg-green-100"
          onClick={() => onShowSideBar?.()}
        >
          <Bars3Icon className="h-5 w-5 ml-1 text-green-700" />
        </div>
      ) : (
        <div></div>
      )}

      {/* 中间标题部分 */}
      {isMobile ? (
        <div className="flex items-center space-x-2">
          <div className="text-sm text-green-600 font-bold">MandLab AI Agent</div>
        </div>
      ) : (
        <div></div>
      )}

      {/* 右侧创建新对话图标 */}
      {isMobile ? (
        <div
          className={`flex items-center justify-center h-10 w-10 cursor-pointer rounded-full hover:bg-green-100`}
          onClick={() => {
            console.log("click isResponding", isResponding)
            if (isResponding) {
              notify({ type: 'info', message: t('app.errorMessage.waitForResponse') })
              return;
            }
            handleClick();
          }}
        >
          <PencilSquareIcon className="h-5 w-5 mr-1 text-green-700" />
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default React.memo(Header);
