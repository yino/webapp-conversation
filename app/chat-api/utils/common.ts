import { type NextRequest } from 'next/server'
import { ChatClient } from 'dify-client'
import { v4 } from 'uuid'
import { API_KEY, API_URL, APP_ID, PUBLIC_PATH } from '@/config'

const userPrefix = `user_${APP_ID}:`

export const getInfo = (request: NextRequest) => {
  const uuid = request.headers.get('uuid');
  let sessionId = request.cookies.get('session_id')?.value || v4()
  if (uuid) {
    sessionId = uuid
  }
  const user = userPrefix + sessionId
  return {
    sessionId,
    user,
  }
}

export const setSession = (sessionId: string) => {
  return { 'Set-Cookie': `session_id=${sessionId}` }
}

const apiUrl = `${API_URL || ''}${PUBLIC_PATH || ''}`
export const client = new ChatClient(API_KEY, apiUrl || undefined)
