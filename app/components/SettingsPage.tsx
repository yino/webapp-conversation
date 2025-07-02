// src/app/components/SettingsPage.tsx
import React, { FC, useState } from 'react'
import {
  ComputerDesktopIcon,
  SunIcon,
  MoonIcon,
  ChevronLeftIcon
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
  
  // 退出确认状态
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 退出确认弹窗 - 移动端优化 */}
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

        {/* 主题色 */}
        <div className="flex justify-between items-center h-12 bg-gray-50 rounded-lg px-4 border border-gray-200">
          <span className="text-sm text-gray-700">主题色</span>
          <div className="flex space-x-2">
            {themeOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => handleChangeTheme(opt)}
                className={`
                  w-8 h-8 flex items-center justify-center rounded-md
                  ${currentTheme === opt 
                    ? 'bg-green-100 border border-green-500' 
                    : 'bg-white border border-gray-300 hover:bg-gray-100'}
                `}
                aria-label={`切换到 ${opt} 模式`}
                title={`切换到 ${opt} 模式`}
              >
                {renderThemeIcon(opt)}
              </button>
            ))}
          </div>
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
