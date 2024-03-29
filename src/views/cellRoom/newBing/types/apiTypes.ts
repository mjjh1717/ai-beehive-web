/*
 * @Author: mjjh
 * @LastEditTime: 2023-07-26 00:43:49
 * @FilePath: \chatgpt-shuowen\src\views\cellRoom\newBing\types\apiTypes.ts
 * @Description:
 */
export interface RoomNewBingListRequest {
  cursor: string
  isAsc: boolean
  isUseCursor: boolean
  roomId: number | string
  size: number
}

/**
 * 响应结果
 */
export interface RoomNewBingResponse {
  /**
   * 状态码
   */
  code?: number
  /**
   * 承载数据
   */
  data?: RoomNewBingMsgVO[]
  /**
   * 返回消息
   */
  message?: string
}

/**
* OpenAi 对话房间消息展示参数
*/
export interface RoomNewBingMsgVO {
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
   * 最大提问次数
   */
  maxNumUserMessagesInConversation?: number
  /**
   * 累计提问次数
   */
  numUserMessagesInConversation?: number
  /**
   * 建议
   */
  suggestResponses?: string[]
  /**
   * 消息类型
   */
  type?: MessageType
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
  /**
     * 是否开启新话题
     */
  isNewTopic: boolean
}
