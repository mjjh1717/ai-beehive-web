/*
 * @Author: mjjh
 * @LastEditTime: 2023-07-04 22:02:33
 * @FilePath: \ai-beehive-web\src\views\cellRoom\newBing\api.ts
 * @Description: 登录注册逻辑
 */
import type { RoomNewBingListRequest, sendRequest } from './types/apiTypes'
import { request } from '@/utils'
let controller = new AbortController()
function handleStop() {
  controller.abort()
  controller = new AbortController()
}
async function loadData(postData: sendRequest, returnData: Function) {
  try {
    const response = await fetch('/api/room/bing/send', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(postData),
      signal: controller.signal,
    })
    // 异常情况返回异常状态
    if (response.status !== 200) {
      const reader = (response as any).body.getReader()
      const { value } = await reader.read()
      const errData = JSON.parse(new TextDecoder().decode(value))
      return errData
    }

    const reader = (response as any).body.getReader()
    let data = ''
    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        returnData(data, done)
        break
      }

      const newText = new TextDecoder().decode(value)

      data += newText
      returnData(data)
    }
  }
  catch {
    console.error('请求失败')
  }
}

export default {
  // 获取房间消息详情
  getRoomDetail: (roomId: number | string) => request.get(`/room/detail?roomId=${roomId}`),
  // 获取消息列表
  getRoomNewBingList: (params: RoomNewBingListRequest) => request.get('/room/bing/list', { params }),
  // RoomOpenaiChatSend: (data: sendRequest) => request.post('/room/openai_chat/send', data),
  RoomNewBingSend: (data: sendRequest, returnData: Function) => loadData(data, returnData),
  handleStop: () => handleStop(),
}
