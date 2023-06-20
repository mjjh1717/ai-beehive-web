/*
 * @Author: mjjh
 * @LastEditTime: 2023-06-21 00:35:13
 * @FilePath: \ai-beehive-web\src\views\cellRoom\openaiImg\types\apiTypes.ts
 * @Description:
 */
export interface RoomOpenAiImageListRequest {
  cursor: string
  isAsc: boolean
  isUseCursor: boolean
  roomId: number
  size: number
}

/**
 * 响应结果
 */
export interface RoomOpenAiImageListResponse {
  /**
   * 状态码
   */
  code?: number
  /**
   * 承载数据
   */
  data?: RoomOpenAiImageMsgVO[]
  /**
   * 返回消息
   */
  message?: string
}

/**
* OpenAi 图像房间消息展示参数
*/
export interface RoomOpenAiImageMsgVO {
  /**
   * 创建时间
   */
  createTime?: Date
  /**
   * 主键
   */
  id?: number
  /**
   * 图像 url
   */
  imageUrl?: string
  /**
   * 消息类型
   */
  messageType?: MessageType
  /**
   * OpenAi 图像 url
   */
  openaiImageUrl?: string
  /**
   * 输入内容
   */
  prompt?: string
  /**
   * 尺寸大小
   */
  size?: string
  /**
   * 消息状态
   */
  status?: Status
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
  prompt: string
  /**
   * 房间 id
   */
  roomId: number
}
/**
 * 消息状态
 */
export enum Status {
  Failure = 'FAILURE',
  Init = 'INIT',
  Success = 'SUCCESS',
}
