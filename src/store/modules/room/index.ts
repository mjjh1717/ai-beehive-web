/*
 * @Author: mjjh
 * @LastEditTime: 2023-06-11 22:23:51
 * @FilePath: \ai-beehive-web\src\store\modules\room\index.ts
 * @Description:
 */
import { defineStore } from 'pinia'
import { getLocal, getLocalExpire, isEmpty, removeLocal, setLocal } from '@/utils'

interface RoomInfo {
  /**
   * cell code
   */
  cellCode?: string
  /**
   * 颜色，十六进制
   */
  color?: string
  /**
   * 创建时间
   */
  createTime?: string
  /**
   * 房间 id
   */
  roomId?: number
  /**
   * 是否固定 false 否 true 是
   */
  isPinned?: boolean
  /**
   * 名称
   */
  name?: string
  // 是否是编辑状态
  isEdit?: boolean
}
interface RoomOpenAiChatMsgVO {
  /**
   * 消息内容
   */
  content?: string
  /**
   * 创建时间
   */
  createTime?: Date
  /**
   * 主键
   */
  id?: number
  /**
   * 消息类型
   */
  messageType?: MessageType
}
enum MessageType {
  Answer = 'answer',
  Question = 'question',
}
const ROOMS_MESSAGE_CODE = 'rooms_message'

//  去重
const unique = (arr: any, key: string) => {
  const result = {}
  for (const item of arr)
    result[item[key]] = item

  return Object.values(result) // 再转化为数组
}

// 筛选
function contains(arr: Array<{ roomId: number; messageList: RoomOpenAiChatMsgVO[] }>, val: number) {
  let selectItem: RoomOpenAiChatMsgVO[] = []
  for (const item of arr) {
    if (item.roomId === val) {
      // console.log('item', item)
      selectItem = item.messageList
      break
    }
  }
  return selectItem
}

export const useRoomStore = defineStore('room', {
  state() {
    return {
      roomInfo: <RoomInfo> {},
      // 存在本地的消息
      messageList: <RoomOpenAiChatMsgVO[]> [],
    }
  },
  getters: {
    roomData(): RoomInfo {
      return this.roomInfo || {}
    },
    messageListData(): RoomOpenAiChatMsgVO[] {
      return this.messageList || []
    },
  },
  actions: {
    resetRoomInfo() {
      this.roomInfo = {}
    },
    setRoomInfo(roomInfo: RoomInfo = {}) {
      this.roomInfo = { ...this.roomInfo, ...roomInfo }
      this.getlocaMessageItem()
    },

    setlocaMessageList(mList: RoomOpenAiChatMsgVO[]) {
      // const locaData = getLocal(ROOMS_MESSAGE_CODE)
      const locaData: Array<{ roomId: number; messageList: RoomOpenAiChatMsgVO[] }> | null = toRaw(getLocal(ROOMS_MESSAGE_CODE))
      this.messageList = mList
      const roomData = {
        roomId: this.roomInfo.roomId,
        messageList: mList,
      }

      if (locaData !== null && !isEmpty(locaData))
        setLocal(ROOMS_MESSAGE_CODE, unique([...locaData, roomData], 'roomId'))

      else
        setLocal(ROOMS_MESSAGE_CODE, [roomData])
    },
    getlocaMessageItem() {
      const locaData: Array<{ roomId: number; messageList: RoomOpenAiChatMsgVO[] }> | null = toRaw(getLocal(ROOMS_MESSAGE_CODE))

      if (locaData !== null && !isEmpty(locaData) && this.roomInfo.roomId)
        this.messageList = contains(locaData, this.roomInfo.roomId)
    },
  },
})
