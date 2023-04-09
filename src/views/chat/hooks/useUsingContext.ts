/*
 * @Author: mjjh
 * @LastEditTime: 2023-04-09 14:20:16
 * @FilePath: \chatgpt-shuowen\src\views\chat\hooks\useUsingContext.ts
 * @Description: 使用上下文相关函数
 */
import { computed } from 'vue'
import { useMessage } from 'naive-ui'
import { t } from '@/locales'
import { useChatStore } from '@/store'

export function useUsingContext() {
  const ms = useMessage()
  const chatStore = useChatStore()
  const usingContext = computed<boolean>(() => chatStore.usingContext)

  /**
   * @description: 切换聊天模式是否存在上下文
   * @return {*}
   */
  function toggleUsingContext() {
    chatStore.setUsingContext(!usingContext.value)
    if (usingContext.value)
      ms.success(t('chat.turnOnContext'))
    else
      ms.warning(t('chat.turnOffContext'))
  }

  return {
    usingContext,
    toggleUsingContext,
  }
}
