import React, { useState, useEffect, useRef } from 'react';

export type GuidePageProps = {
  isMobile?: boolean;
};

const GuidePage: React.FC<GuidePageProps> = ({ isMobile = false }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(1);
  const [visible, setVisible] = useState(() => {
    // 检查localStorage中是否有hasSeenGuide标志，如果没有则显示引导页
    const hasSeenGuide = localStorage.getItem('hasSeenGuide');
    return hasSeenGuide !== 'true';
  });

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

  if (!isMobile || !visible) return null;

  const renderStep1 = () => (
    <div className="relative w-full h-full">
      {/* 左上按钮高亮 */}
      <div className="absolute flex flex-col items-center" style={{ left: '20px', top: '10px' }}>
        <div className="rounded-full border-2 border-dashed border-white w-10 h-10 mr-20" />
        <div className="rounded-full text-white text-sm mb-1 mt-5 px-2 py-1 border border-dashed border-white">
          查看历史对话和<br />您的账户信息
        </div>
      </div>

      {/* 右上按钮高亮 */}
      <div className="absolute flex flex-col items-center" style={{ right: '20px', top: '10px' }}>
        <div className="rounded-full border-2 border-dashed border-white w-10 h-10 ml-16" />
        <div className="rounded-full text-white text-sm mb-1 mt-5 px-2 py-1 border border-dashed border-white">
          开启新<br />的对话
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <button
          className="mt-7 text-white hover:text-gray-200 border-2 border-dashed border-white px-6 py-3"
          onClick={(e) => {
            e.stopPropagation();
            setStep(2);
          }}
        >
          下一步
        </button>
        <button
          className="mt-4 text-white text-sm hover:text-gray-200"
          onClick={(e) => {
            e.stopPropagation();
            setVisible(false);
            localStorage.setItem('hasSeenGuide', 'true'); // 设置标志，下次不再显示
          }}
        >
          跳过
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="relative w-full h-full">
      <div className="absolute flex flex-col items-center" style={{ left: '50%', top: '60%', transform: 'translate(-50%, -50%)' }}>
        <button
          className="text-white hover:text-gray-200 border-2 border-dashed border-white px-6 py-3"
          onClick={(e) => {
            e.stopPropagation();
            setVisible(false);
            localStorage.setItem('hasSeenGuide', 'true'); // 设置标志，下次不再显示
          }}
        >
          开始体验
        </button>
      </div>

      <div className="absolute flex flex-col items-center" style={{ left: '50%', bottom: '60px', transform: 'translateX(-50%)' }}>
        <div className="text-white text-sm mb-1 mt-5 px-4 py-3 border border-dashed border-white rounded-full text-center">
          输入您想了解的问题<br />并发送，我们会为您<br />实时解答
        </div>
        <div className="rounded-full border-2 mt-5 border-white w-72 h-12" />
      </div>
    </div>
  );

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 cursor-pointer"
    >
      {step === 1 ? renderStep1() : renderStep2()}
    </div>
  );
};

export default GuidePage;
