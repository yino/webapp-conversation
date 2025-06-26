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
  onSend = () => { },
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
    if (!valid() || (checkCanSend && !checkCanSend()))
      return
    onSend(queryRef.current, files.filter(file => file.progress !== -1).map(fileItem => ({
      type: 'image',
      transfer_method: fileItem.type,
      url: fileItem.url,
      upload_file_id: fileItem.fileId,
    })))
    if (!files.find(item => item.type === TransferMethod.local_file && !item.fileId)) {
      if (files.length)
        onClear()
      if (!isResponding) {
        setQuery('')
        queryRef.current = ''
      }
    }
  }

  const handleKeyUp = (e: any) => {
    if (e.code === 'Enter') {
      e.preventDefault()
      if (!e.shiftKey && !isUseInputMethod.current)
        handleSend()
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

  useEffect(() => {
    if (chatList.length > 0 && welcomeRef.current) {
      welcomeRef.current.style.display = 'none'
    }
  }, [chatList])

  return (
    <div className={cn(!feedbackDisabled && 'px-3.5', 'h-full w-full overflow-x-hidden')}>
      {/* Chat List */}
      {/* PC */}
      <div className="h-full space-y-[30px]">
        {chatList.length === 0 && !isMobile ? (
          <div className='absolute bottom-20' style={{ width: "100%" }}>
            <div className='flex justify-around items-center py-2 text-xl font-medium text-gray-700 text-center bottom-10
'>{t('app.common.welcome')}</div>
            <div className='flex justify-around items-center py-2 text-[0.8rem] font-medium text-gray-700  text-center'>{t('app.common.welcomeDesc')}</div>
          </div>
        ) : (
          chatList.map((item) => {
            if (item.isAnswer) {
              const isLast = item.id === chatList[chatList.length - 1].id
              return <Answer
                key={item.id}
                item={item}
                feedbackDisabled={feedbackDisabled}
                onFeedback={onFeedback}
                isResponding={isResponding && isLast}
                suggestionClick={suggestionClick}
              />
            }
            return (
              <Question
                key={item.id}
                id={item.id}
                content={item.content}
                useCurrentUserAvatar={useCurrentUserAvatar}
                imgSrcs={(item.message_files && item.message_files?.length > 0) ? item.message_files.map(item => item.url) : []}
              />
            )
          })
        )}
        {/* H5 */}
        {isMobile && (
          <div className="h-full w-full space-y-[30px] overflow-y-auto overflow-x-hidden">
            {chatList.length === 0 && showWelcome && (
              <>
                <div ref={welcomeRef} className="mb-10">
                  <h1 className="text-center text-2xl font-bold text-green-500 mb-4">
                    我是您可持续领域工作的智能助手<br />很高兴见到你！
                  </h1>
                  <p className="text-center text-gray-500 mb-8">
                    我可以解答您在绿色金融、ESG相关的问题任何，<br />并支持您更好开展学习与工作。
                  </p>
                </div>

                <div className="mb-5">
                  <p className="text-gray-500 mb-3">您可以问我这些问题：</p>
                  <div className="space-y-2">
                    <button
                      onClick={() => suggestionClick('最近有什么ESG相关政策')}
                      className="w-full text-left text-gray-400 bg-gray-50 rounded p-2"
                    >
                      最近有什么ESG相关政策
                    </button>
                    <button
                      onClick={() => suggestionClick('最近有什么绿色金融相关政策')}
                      className="w-full text-left text-gray-400 bg-gray-50 rounded p-2"
                    >
                      最近有什么绿色金融相关政策
                    </button>
                    <button
                      onClick={() => suggestionClick('关于最近出台的《绿色金融****》政策你怎么看')}
                      className="w-full text-left text-gray-400 bg-gray-50 rounded p-2"
                    >
                      关于最近出台的《绿色金融****》政策你怎么看
                    </button>
                  </div>
                </div>
              </>
            )}

            {chatList.map((item) => {
              if (item.isAnswer) {
                const isLast = item.id === chatList[chatList.length - 1].id
                return <Answer
                  key={item.id}
                  item={item}
                  feedbackDisabled={feedbackDisabled}
                  onFeedback={onFeedback}
                  isResponding={isResponding && isLast}
                  suggestionClick={suggestionClick}
                />
              }
              return (
                <Question
                  key={item.id}
                  id={item.id}
                  content={item.content}
                  useCurrentUserAvatar={useCurrentUserAvatar}
                  imgSrcs={(item.message_files && item.message_files?.length > 0)
                    ? item.message_files.map(file => file.url)
                    : []
                  }
                />
              )
            })}
          </div>
        )}
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
                className={`
                block w-full px-2 pr-[118px] py-[7px] leading-5 max-h-none text-sm text-gray-700 outline-none appearance-none resize-none
                ${visionConfig?.enabled && 'pl-12'}
              `}
                value={query}
                onChange={handleContentChange}
                onKeyUp={handleKeyUp}
                onKeyDown={handleKeyDown}
                autoSize
              />
              <div className="absolute bottom-2 right-2 flex items-center h-8">
                <div className={`${s.count} mr-4 h-5 leading-5 text-sm bg-gray-50 text-gray-500`}>{query.trim().length}</div>
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
    </div>
  )
}

export default React.memo(Chat)
