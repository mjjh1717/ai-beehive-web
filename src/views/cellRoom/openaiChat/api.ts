/*
 * @Author: mjjh
 * @LastEditTime: 2023-05-28 22:44:14
 * @FilePath: \ai-beehive-web\src\views\login\api.ts
 * @Description: 登录注册逻辑
 */
import type { RoomOpenaiChatListRequest } from './types/apiTypes'
import { request } from '@/utils'

export default {
  // 登录接口
  getRoomOpenaiChatList: (params: RoomOpenaiChatListRequest) => request.get('/room/openai_chat/list', { params }),
}
