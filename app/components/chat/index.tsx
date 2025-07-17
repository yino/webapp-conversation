'use client'
import type { FC } from 'react'
import React, { useEffect, useRef } from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import Textarea from 'rc-textarea'
import s from './style.module.css'
import Answer from './answer'
import Question from './question'
import type { FeedbackFunc } from './type'
import type { ChatItem, VisionFile, VisionSettings } from '@/types/app'
import { TransferMethod } from '@/types/app'
import Tooltip from '@/app/components/base/tooltip'
import Toast from '@/app/components/base/toast'
import ChatImageUploader from '@/app/components/base/image-uploader/chat-image-uploader'
import ImageList from '@/app/components/base/image-uploader/image-list'
import { useImageFiles } from '@/app/components/base/image-uploader/hooks'

export type IChatProps = {
  chatList: ChatItem[]
  showWelcome: boolean
  feedbackDisabled?: boolean
  isHideSendInput?: boolean
  onFeedback?: FeedbackFunc
  checkCanSend?: () => boolean
  onSend?: (message: string, files: VisionFile[]) => void
  useCurrentUserAvatar?: boolean
  isResponding?: boolean
  controlClearQuery?: number
  visionConfig?: VisionSettings
}

const Chat: FC<IChatProps> = ({
  chatList,
  showWelcome = true,
  feedbackDisabled = false,
  isHideSendInput = false,
  onFeedback,
  checkCanSend,
  onSend = () => {},
  useCurrentUserAvatar,
  isResponding,
  controlClearQuery,
  visionConfig,
  isMobile = false,
}) => {
  const { t } = useTranslation()
  const { notify } = Toast
  const isUseInputMethod = useRef(false)

  const [query, setQuery] = React.useState('')
  const queryRef = useRef('')
  const welcomeRef = useRef<HTMLDivElement>(null)
  // 用于自动滚动到底部的哨兵元素
  const bottomRef = useRef<HTMLDivElement>(null)

  const handleContentChange = (e: any) => {
    const value = e.target.value
    setQuery(value)
    queryRef.current = value
  }

  const logError = (message: string) => {
    notify({ type: 'error', message, duration: 3000 })
  }

  const valid = () => {
    const query = queryRef.current
    if (!query || query.trim() === '') {
      logError(t('app.errorMessage.valueOfVarRequired'))
      return false
    }
    return true
  }

  useEffect(() => {
    if (controlClearQuery) {
      setQuery('')
      queryRef.current = ''
    }
  }, [controlClearQuery])

  const {
    files,
    onUpload,
    onRemove,
    onReUpload,
    onImageLinkLoadError,
    onImageLinkLoadSuccess,
    onClear,
  } = useImageFiles()

  const handleSend = () => {
    if (!valid() || (checkCanSend && !checkCanSend())) return
    onSend(
      queryRef.current,
      files.filter(file => file.progress !== -1).map(fileItem => ({
        type: 'image',
        transfer_method: fileItem.type,
        url: fileItem.url,
        upload_file_id: fileItem.fileId,
      })),
    )
    if (!files.find(item => item.type === TransferMethod.local_file && !item.fileId)) {
      if (files.length) onClear()
      if (!isResponding) {
        setQuery('')
        queryRef.current = ''
      }
    }
  }

  const handleKeyUp = (e: any) => {
    if (e.code === 'Enter') {
      e.preventDefault()
      if (!e.shiftKey && !isUseInputMethod.current) handleSend()
    }
  }

  const handleKeyDown = (e: any) => {
    isUseInputMethod.current = e.nativeEvent.isComposing
    if (e.code === 'Enter' && !e.shiftKey) {
      const result = query.replace(/\n$/, '')
      setQuery(result)
      queryRef.current = result
      e.preventDefault()
    }
  }

  const suggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    queryRef.current = suggestion
    handleSend()
  }

  // 隐藏欢迎语
  useEffect(() => {
    if (chatList.length > 0 && welcomeRef.current) {
      welcomeRef.current.style.display = 'none'
    }
  }, [chatList])

  // 监听 chatList 变化，滚动到底部
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatList])

  return (
    <div className={cn(!feedbackDisabled && 'px-3.5', 'h-full w-full overflow-x-hidden')}>
      {/* Chat List */}
      {chatList.length === 0 && !isMobile ? (
        <div className='absolute bottom-20' style={{ width: '100%' }}>
          <div className='flex justify-around items-center py-2 text-xl font-medium text-gray-700 text-center'>
            {t('app.common.welcome')}
          </div>
          <div className='flex justify-around items-center py-2 text-[0.8rem] font-medium text-gray-700 text-center'>
            {t('app.common.welcomeDesc')}
          </div>
        </div>
      ) : isMobile ? (
        <div className='h-full w-full space-y-[30px] overflow-y-auto overflow-x-hidden'>
          {chatList.length === 0 && showWelcome && (
            <>
              <div ref={welcomeRef} className='flex flex-col items-center justify-center h-full text-center'>
                <h1 className='text-xl font-bold text-green-500 mb-5'>您好，我是MandLab，您随身的<br/>绿色金融与ESG工作智能助手</h1>
                <p className='text-gray-500 mb-8'>我还在努力学习成长中，目前的我可以为您解答<br/>ESG报告框架和关键议题方案问题</p>
              </div>
            </>
          )}
          {chatList.map(item =>
            item.isAnswer ? (
              <Answer
                key={item.id}
                item={item}
                feedbackDisabled={feedbackDisabled}
                onFeedback={onFeedback}
                isResponding={isResponding && item.id === chatList[chatList.length - 1].id}
                suggestionClick={suggestionClick}
              />
            ) : (
              <Question
                key={item.id}
                id={item.id}
                content={item.content}
                useCurrentUserAvatar={useCurrentUserAvatar}
                imgSrcs={(item.message_files || []).map(f => f.url)}
              />
            ),
          )}
          {/* 哨兵元素，滚动时定位 */}
          <div ref={bottomRef} />
        </div>
      ) : (
        <div className='h-full space-y-[30px] overflow-y-auto'>
          {chatList.map(item =>
            item.isAnswer ? (
              <Answer
                key={item.id}
                item={item}
                feedbackDisabled={feedbackDisabled}
                onFeedback={onFeedback}
                isResponding={isResponding && item.id === chatList[chatList.length - 1].id}
                suggestionClick={suggestionClick}
              />
            ) : (
              <Question
                key={item.id}
                id={item.id}
                content={item.content}
                useCurrentUserAvatar={useCurrentUserAvatar}
                imgSrcs={(item.message_files || []).map(f => f.url)}
              />
            ),
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {/* 发送区域 */}
      {!isHideSendInput && (
        <div className={cn(!feedbackDisabled && '!left-3.5 !right-3.5', 'absolute z-10 bottom-0 left-0 right-0')}>
          <div className='p-[5.5px] max-h-[150px] bg-white border-[1.5px] border-gray-200 rounded-xl overflow-y-auto'>
            {visionConfig?.enabled && (
              <>
                <div className='absolute bottom-2 left-2 flex items-center'>
                  <ChatImageUploader
                    settings={visionConfig}
                    onUpload={onUpload}
                    disabled={files.length >= visionConfig.number_limits}
                  />
                  <div className='mx-1 w-[1px] h-4 bg-black/5' />
                </div>
                <div className='pl-[52px] overflow-x-hidden'>
                  <ImageList
                    list={files}
                    onRemove={onRemove}
                    onReUpload={onReUpload}
                    onImageLinkLoadSuccess={onImageLinkLoadSuccess}
                    onImageLinkLoadError={onImageLinkLoadError}
                  />
                </div>
              </>
            )}
            <Textarea
              className={`block w-full px-2 pr-[118px] py-[7px] leading-5 max-h-none text-sm text-gray-700 outline-none appearance-none resize-none ${visionConfig?.enabled && 'pl-12'} font-size: 16px !important; -webkit-text-size-adjust: 100%; -webkit-fill-available;`}
              style={{ fontSize: '16px', WebkitTextSizeAdjust: '100%' }}
              value={query}
              onChange={handleContentChange}
              onKeyUp={handleKeyUp}
              onKeyDown={handleKeyDown}
              autoSize
            />
            <div className='absolute bottom-2 right-2 flex items-center h-8'>
              <Tooltip
                selector='send-tip'
                htmlContent={
                  <div>
                    <div>{t('common.operation.send')} Enter</div>
                    <div>{t('common.operation.lineBreak')} Shift Enter</div>
                  </div>
                }
              >
                <div className={`${s.sendBtn} w-8 h-8 cursor-pointer rounded-md`} onClick={handleSend}></div>
              </Tooltip>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default React.memo(Chat)
