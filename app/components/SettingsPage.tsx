// src/app/components/SettingsPage.tsx
import React, { FC, useEffect, useState } from 'react'
import {privacyPolicy, serviceAgreement} from '@/app/components/sidebar/policies.js';
import {
  ComputerDesktopIcon,
  SunIcon,
  MoonIcon,
  ChevronLeftIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import Button from '@/app/components/base/button'
import { fetchUserInfo, UserInfo } from '@/app/components/userInfo.ts';

type ThemeOption = 'system' | 'light' | 'dark'

type SettingsPageProps = {
  onBack: () => void;
}

const SettingsPage: FC<SettingsPageProps> = ({ onBack }) => {
  // 内置数据
  const phoneNumber = '158****1234'
  const inviteCode = '12345678'
  const contactNumber = '(0571) 8605 8021'

  // 主题状态
  const [currentTheme, setCurrentTheme] = useState<ThemeOption>('system')
  // 格式化手机号
  const formatPhone = (phone: string): string => {
    // 保留手机号前 3 位和后 2 位，中间用星号替换
    return phone.replace(/(\d{3})\d{4}(\d{2})/, '$1*****$2');
  };
  // 弹窗状态
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [showAgreement, setShowAgreement] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)

  // 渲染图标
  const renderThemeIcon = (option: ThemeOption) => {
    switch (option) {
      case 'system':
        return <ComputerDesktopIcon className="w-5 h-5 text-gray-700" />
      case 'light':
        return <SunIcon className="w-5 h-5 text-gray-700" />
      case 'dark':
        return <MoonIcon className="w-5 h-5 text-gray-700" />
    }
  }

  const themeOptions: ThemeOption[] = ['system', 'light', 'dark']
const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

useEffect(() => {
  const loadUserInfo = async () => {
    const info = await fetchUserInfo();
    setUserInfo(info);
  };
  loadUserInfo();
}, []);

  // 各按钮回调
  const handleChangeTheme = (opt: ThemeOption) => {
    setCurrentTheme(opt)
    console.log('切换主题到：', opt)
  }
  
  const handleLogout = () => {
    setShowLogoutConfirm(true)
  }
  
  const confirmLogout = () => {
    // 清除登录凭证
    localStorage.removeItem('login_token')
    // 关闭当前页面并跳转到登录页
    window.location.href = process.env.NEXT_PUBLIC_LOGIN_URL || '/web';
    // 关闭所有页面 
    window.open('about:blank', '_self')
    window.location.replace(process.env.NEXT_PUBLIC_LOGIN_URL || '/web')
  }
  
  const cancelLogout = () => {
    setShowLogoutConfirm(false)
  }
  
  const handleOpenAbout = () => {
    console.log('打开关于我们')
    // TODO: 跳转或弹出关于我们
  }

  // 渲染弹窗组件
  const renderModal = (title: string, content: string, isOpen: boolean, onClose: () => void) => {
    if (!isOpen) return null
    
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-md shadow-xl animate-scale-in max-h-[80vh] overflow-y-auto">
          <div className="sticky top-0 bg-white z-10 p-4 flex justify-between items-center border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div className="p-5">
            <div className="prose prose-sm text-gray-700">
              {content.split('\n').map((para, i) => (
                <p key={i} className="mb-3">{para}</p>
              ))}
            </div>
          </div>
          
          <div className="flex p-4 border-t border-gray-100">
            <button
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium hover:opacity-90 transition-opacity"
              onClick={onClose}
            >
              我知道了
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 弹窗区域 */}
      {renderModal(
        '服务协议', 
        serviceAgreement,
        showAgreement,
        () => setShowAgreement(false)
      )}
      
      {renderModal(
        '隐私政策', 
        privacyPolicy,
        showPrivacy,
        () => setShowPrivacy(false)
      )}

      {/* 退出确认弹窗 */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xs shadow-xl animate-scale-in">
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-800 text-center">确认退出账号？</h3>
              <p className="mt-1 text-sm text-gray-500 text-center">您的账户将保持安全，下次需要重新登录</p>
            </div>
            
            {/* 水平排列的按钮 */}
            <div className="flex gap-3 p-4 border-t border-gray-100">
              <button
                className="flex-1 py-2.5 rounded-lg bg-gray-100 text-gray-800 font-medium hover:bg-gray-200 transition-colors"
                onClick={cancelLogout}
              >
                取消
              </button>
              <button
                className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium hover:opacity-90 transition-opacity"
                onClick={confirmLogout}
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 头部导航栏 */}
      <div className="flex items-center justify-between p-4 bg-green-500 border-b border-green-600 sticky top-0 z-10">
        <button 
          onClick={onBack}
          className="flex items-center text-white"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-white">MandLab研以致用</h1>
        </div>
        <div className="w-6"></div> {/* 占位保持对称 */}
      </div>

      <div className="mt-4 space-y-2 px-4 flex-1 overflow-y-auto">
       {/* 手机号码 */}
       <div className="flex justify-between items-center h-12 bg-gray-50 rounded-lg px-4 border border-gray-200">
         <span className="text-sm text-gray-700">手机号码</span>
         <span className="text-sm text-gray-900 font-medium"> {userInfo?.phone ? formatPhone(userInfo.phone) : '无'}</span>
       </div>
       
       {/* 邀请码 */}
       <div className="flex justify-between items-center h-12 bg-gray-50 rounded-lg px-4 border border-gray-200">
         <span className="text-sm text-gray-700">邀请码</span>
         <span className="text-sm text-gray-900 font-medium">{userInfo?.invite_code || '无'}</span>
       </div>
       
        {/* 联系我们 */}
        <div className="flex justify-between items-center h-12 bg-gray-50 rounded-lg px-4 border border-gray-200">
          <span className="text-sm text-gray-700">联系我们</span>
          <span className="text-sm text-gray-900 font-medium">{contactNumber}</span>
        </div>

        {/* 服务协议 */}
        <button
          onClick={() => setShowAgreement(true)}
          className="w-full text-left flex items-center h-12 bg-gray-50 rounded-lg px-4 border border-gray-200 hover:bg-gray-100"
        >
          <span className="text-sm text-gray-700">服务协议</span>
        </button>
        
        {/* 隐私政策 */}
        <button
          onClick={() => setShowPrivacy(true)}
          className="w-full text-left flex items-center h-12 bg-gray-50 rounded-lg px-4 border border-gray-200 hover:bg-gray-100"
        >
          <span className="text-sm text-gray-700">隐私政策</span>
        </button>
      </div>

      {/* 底部退出按钮 */}
      <div className="p-4">
        <Button
          onClick={handleLogout}
          className="w-full h-10 bg-white border border-green-500 text-green-500 rounded-lg hover:bg-green-50"
        >
          退出账号
        </Button>
      </div>
    </div>
  )
}

export default React.memo(SettingsPage)
