// src/app/components/SettingsPage.tsx
import React, { FC, useState } from 'react'
import {
  ComputerDesktopIcon,
  SunIcon,
  MoonIcon,
  ChevronLeftIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import Button from '@/app/components/base/button'

type ThemeOption = 'system' | 'light' | 'dark'

type SettingsPageProps = {
  onBack: () => void;
}

const SettingsPage: FC<SettingsPageProps> = ({ onBack }) => {
  // 内置数据
  const phoneNumber = '158****1234'
  const inviteCode = '12345678'
  const contactNumber = '0571-123124'

  // 主题状态
  const [currentTheme, setCurrentTheme] = useState<ThemeOption>('system')
  
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
    // 跳转到登录页
    window.location.href = process.env.NEXT_PUBLIC_LOGIN_URL || '/web';
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
        '欢迎您使用MandLab研以致用服务！\n\n' +
        '本协议是您与MandLab之间关于使用本服务所订立的协议。请在使用服务前仔细阅读本协议，特别是免除或者限制责任的条款。\n\n' +
        '1. 服务内容\n' +
        'MandLab为您提供专业的科研工具和服务，包括但不限于数据分析、实验设计等功能。\n\n' +
        '2. 使用规则\n' +
        '您在使用服务时需遵守国家法律法规，不得利用服务从事任何违法违规活动。\n\n' +
        '3. 知识产权\n' +
        '本服务所有内容的知识产权归MandLab所有，未经书面许可，不得擅自使用。',
        showAgreement,
        () => setShowAgreement(false)
      )}
      
      {renderModal(
        '隐私政策', 
        'MandLab研以致用（以下简称"我们"）非常重视用户隐私保护。本政策将帮助您了解：\n\n' +
        '1. 我们收集哪些信息\n' +
        '为提供服务，我们会收集您的设备信息、使用日志等必要信息。\n\n' +
        '2. 信息使用方式\n' +
        '收集的信息仅用于改进产品、提供服务和保障账户安全。\n\n' +
        '3. 信息共享\n' +
        '我们不会将您的个人信息出售给第三方，仅在法律要求或提供服务所必需时共享信息。\n\n' +
        '4. 信息安全\n' +
        '我们采用行业标准安全措施保护您的信息，但无法保证绝对安全。',
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
          <span className="text-sm text-gray-900 font-medium">{phoneNumber}</span>
        </div>

        {/* 邀请码 */}
        <div className="flex justify-between items-center h-12 bg-gray-50 rounded-lg px-4 border border-gray-200">
          <span className="text-sm text-gray-700">邀请码</span>
          <span className="text-sm text-gray-900 font-medium">{inviteCode}</span>
        </div>

        {/* 联系我们 */}
        <div className="flex justify-between items-center h-12 bg-gray-50 rounded-lg px-4 border border-gray-200">
          <span className="text-sm text-gray-700">联系我们</span>
          <span className="text-sm text-gray-900 font-medium">{contactNumber}</span>
        </div>

        {/* 关于我们 */}
        <button
          onClick={handleOpenAbout}
          className="w-full text-left flex items-center h-12 bg-gray-50 rounded-lg px-4 border border-gray-200 hover:bg-gray-100"
        >
          <span className="text-sm text-gray-700">关于我们</span>
        </button>
        
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
