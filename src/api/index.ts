/*
 * @Author: mjjh
 * @LastEditTime: 2023-04-15 23:26:51
 * @FilePath: \chatgpt-shuowen\src\api\index.ts
 * @Description:
 */
import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { post } from '@/utils/request'

export function fetchChatAPI<T = any>(
  prompt: string,
  options?: { conversationId?: string; parentMessageId?: string },
  signal?: GenericAbortSignal,
) {
  return post<T>({
    url: '/chat',
    data: { prompt, options },
    signal,
  })
}

export function fetchChatAPIProcess<T = any>(
  params: {
    prompt: string
    options?: { conversationId?: string; parentMessageId?: string }
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void },
) {
  let data: Record<string, any> = {
    prompt: params.prompt,
    options: params.options,
  }

  data = {
    ...data,
    systemMessage: 'You are ChatGPT, a large language model trained by OpenAI. Follow the user\'s instructions carefully. Respond using markdown.',
  }

  return post<T>({
    url: '/chat_process',
    data,
    signal: params.signal,
    onDownloadProgress: params.onDownloadProgress,
  })
}
