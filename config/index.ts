import type { AppInfo } from '@/types/app'
export const APP_ID = `${process.env.NEXT_PUBLIC_APP_ID}`
export const API_KEY = `${process.env.NEXT_PUBLIC_APP_KEY}`
export const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`
export const SESSION_API = `${process.env.NEXT_PUBLIC_SESSION_API_URL}`
export const PUBLIC_PATH = `${process.env.NEXT_PUBLIC_PATH}`

export const APP_INFO: AppInfo = {
  title: 'MandLab研以致用',
  description: '',
  copyright: '',
  privacy_policy: '',
  default_language: 'zh-Hans',
}

export const isShowPrompt = false
export const promptTemplate = 'I want you to act as a javascript console.'

export const API_PREFIX = `/chat-api`

export const LOCALE_COOKIE_NAME = 'locale'

export const DEFAULT_VALUE_MAX_LEN = 48

export const SESSION_API_PREFIX = '/api/v1'