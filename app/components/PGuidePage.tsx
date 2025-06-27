import React, { useState, useEffect, useRef } from 'react';

export type GuidePageProps = {
  isMobile?: boolean;
};

const GuidePage: React.FC<GuidePageProps> = ({ isMobile = false }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('hasSeenGuide');
    if (hasSeenGuide === 'true') {
      setVisible(false);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
        setVisible(false);
        localStorage.setItem('hasSeenGuide', 'true'); // 设置标志，下次不再显示
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // PC端显示，移动端不显示
  if (isMobile || !visible) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50 select-none"
    >
      <div className="relative w-full h-full">

        {/* 左侧栏高亮 */}
<div className="absolute top-0 left-0 w-64 ml-36 mt-8 h-full">
  <div className="mt-8 ml-11 space-y-4">
    <div className="flex items-center space-x-4">
      <div className="rounded-full border-2 border-dashed border-white w-10 h-10" />
      <div className="rounded-full text-white text-sm w-16 px-2 py-1 border border-dashed border-white">
        收起功能栏
      </div>
    </div>
    <div className=" mt-10 border-dashed border-white rounded-lg p-2 text-white">
      开启新的对话记录<br/>查看历史对话记录
    </div>
  </div>
</div>

        {/* 左下查看账户信息 */}
        <div className="absolute bottom-12 left-8 flex items-center space-x-2 mb-5 ml-3">
          <div className="ml-10 text-white text-sm border-2 border-dashed border-white rounded-lg px-2 py-1">
            查看账户信息
          </div>
        </div>

        {/* 底部输入框高亮 与 气泡提示 */}
        <div className="absolute bottom-8 left-1/2 ml-20  mb-11 transform -translate-x-1/2 w-2/3">
          <div className="relative">
            <div className="border-2 border-dashed  border-white bg-white bg-opacity-10 rounded-full h-12 flex items-center px-4 ml-20">
              <input
                className="w-full bg-transparent outline-none text-white placeholder-gray-200"
                placeholder="给 Mandlab 发送消息吧"
                disabled
              />
              <button className="ml-4">
                <svg className="w-6 h-6 text-green-400" viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
              </button>
            </div>
            {/* 右侧气泡 */}
            <div className="absolute -top-16 right-0 w-40 mb-10">
              <div className="text-white text-xs p-2  border-dashed  border-white  rounded-lg">
                输入您想了解的问题并<br/>发送，我们会为您实时解答
              </div>
              <div className="w-2 h-2 bg-white rotate-45 absolute -bottom-1 right-4"></div>
            </div>
          </div>
        </div>

        {/* 中央“开始体验”按钮 */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <button
            className="border-2 border-dashed border-white text-white px-6 py-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition"
            onClick={(e) => {
              e.stopPropagation();
              setVisible(false);
              localStorage.setItem('hasSeenGuide', 'true'); // 设置标志，下次不再显示
            }}
          >
            开始体验
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuidePage;
