/*
 * @Author: mjjh
 * @LastEditTime: 2023-04-09 14:17:50
 * @FilePath: \chatgpt-shuowen\src\views\chat\hooks\useChat.ts
 * @Description: 使用chat相关函数
 */
import { useChatStore } from '@/store'

export function useChat() {
  const chatStore = useChatStore()

  const getChatByUuidAndIndex = (uuid: number) => {
    return chatStore.getChatByUuidAndIndex(uuid)
  }

  const addChat = (uuid: number, chat: Chat.Chat, SystemRoleValue: String) => {
    chatStore.addChatByUuid(uuid, chat, SystemRoleValue)
  }

  const updateChat = (uuid: number, index: number, chat: Chat.Chat, SystemRoleValue: String) => {
    chatStore.updateChatByUuid(uuid, index, chat, SystemRoleValue)
  }

  const updateChatSome = (uuid: number, index: number, chat: Partial<Chat.Chat>) => {
    chatStore.updateChatSomeByUuid(uuid, index, chat)
  }

  return {
    addChat,
    updateChat,
    updateChatSome,
    getChatByUuidAndIndex,
  }
}
