export interface RoomOpenaiChatListRequest {
  cursor: string
  isAsc: boolean
  isUseCursor: boolean
  roomId: number | string
  size: number
}

/**
 * 响应结果
 */
export interface RoomOpenaiChatListResponse {
  /**
   * 状态码
   */
  code?: number
  /**
   * 承载数据
   */
  data?: RoomOpenAiChatMsgVO[]
  /**
   * 返回消息
   */
  message?: string
}

/**
* OpenAi 对话房间消息展示参数
*/
export interface RoomOpenAiChatMsgVO {
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

/**
* 消息类型
*/
export enum MessageType {
  Answer = 'answer',
  Question = 'question',
}

export interface sendRequest {
  /**
   * 消息内容
   */
  content: string
  /**
   * 房间 id
   */
  roomId: number | string
}
