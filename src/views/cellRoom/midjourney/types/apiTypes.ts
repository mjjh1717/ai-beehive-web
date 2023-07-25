/**
 * Midjourney 房间列表请求数据参数
 */
export interface RoomMidjourneyRequest {
  cursor: string
  isAsc: boolean
  isUseCursor: boolean
  roomId: number | string
  size: number
}
/**
 * Midjourney 创建图像参数
 */
export interface ImagineRequest {
  /**
   * 提示语
   */
  prompt: string
  /**
   * 房间 id
   */
  roomId: number | string
}
/**
 * Midjourney 描述请求
 */
export interface DescribeRequest {
  file: any
  /**
   * 房间 id
   */
  roomId: number | string
}
/**
 * Midjourney upscale 转换请求参数
 */
export interface UpscaleRequest {
  /**
   * 下标
   */
  index: number
  /**
   * 消息 id
   */
  msgId: number
  /**
   * 房间 id
   */
  roomId: number | string
}
/**
 * Midjourney variation 转换请求参数
 */
export interface VariationRequest {
  /**
   * 下标
   */
  index: number
  /**
   * 消息 id
   */
  msgId: number
  /**
   * 房间 id
   */
  roomId: number | string
}
/**
 * Midjourney 房间列表请求响应结果
 */
export interface Response {
  /**
   * 状态码
   */
  code?: number
  /**
   * 承载数据
   */
  data?: RoomMidjourneyMsgVO[]
  /**
   * 返回消息
   */
  message?: string
}

/**
* Midjourney 房间消息
*/
export interface RoomMidjourneyMsgVO {
  /**
     * 指令动作枚举
     */
  action?: Action
  /**
   * 压缩图片地址
   */
  compressedImageUrl?: string
  /**
   * 处理过后的压缩图片地址
   */
  compressedImageUrlPlus?: string
  /**
   * 创建时间
   */
  createTime?: Date
  /**
   * discord 结束时间
   */
  discordFinishTime?: Date
  /**
   * discord 图片地址
   */
  discordImageUrl?: string
  /**
   * discord 开始时间
   */
  discordStartTime?: Date
  /**
   * 最终的输入
   */
  finalPrompt?: string
  /**
   * 消息 id
   */
  id?: number
  /**
   * 原始图片地址
   */
  originalImageUrl?: string
  /**
   * 处理过后的原始图片地址
   */
  originalImageUrlPlus?: string
  /**
   * 用户输入
   */
  prompt?: string
  /**
   * 响应内容
   */
  responseContent?: string
  /**
   * 房间 id
   */
  roomId?: number
  /**
   * 状态枚举
   */
  status?: Status
  /**
   * 消息类型
   */
  type?: Type
  uuseBit?: number
  /**
   * uv 位置
   */
  uvIndex?: number
  /**
   * 排队中的队列长度
   */
  waitQueueLength?: number
}

export enum Action {
  Describe = 'DESCRIBE',
  Imagine = 'IMAGINE',
  Upscale = 'UPSCALE',
  Variation = 'VARIATION',
}

export enum Status {
  MJFailure = 'MJ_FAILURE', // MJ 失败
  MjInProgress = 'MJ_IN_PROGRESS', // MJ 执行中
  MjSuccess = 'MJ_SUCCESS', // MJ 成功
  MjWaitReceived = 'MJ_WAIT_RECEIVED', // 等待 MJ 接受消息
  SysFailure = 'SYS_FAILURE', // 系统发送 MJ 请求失败
  SysFinishMjInProgressFailure = 'SYS_FINISH_MJ_IN_PROGRESS_FAILURE', // 系统完成 MJ 执行中任务失败
  SysMaxQueue = 'SYS_MAX_QUEUE', // 系统排队上限
  SysQueuing = 'SYS_QUEUING', // 系统排队中
  SysSendMjRequestFailure = 'SYS_SEND_MJ_REQUEST_FAILURE', // 系统等待 MJ 接收消息失败
  SysSuccess = 'SYS_SUCCESS', // 系统成功
  SysWaitMjReceivedFailure = 'SYS_WAIT_MJ_RECEIVED_FAILURE', // 系统发送 MJ 请求失败
}

export enum Type {
  Answer = 'answer',
  Question = 'question',
}

/**
 * 通用响应结果
 */
export interface genlResponse {
  /**
   * 状态码
   */
  code?: number
  /**
   * 承载数据
   */
  data?: boolean
  /**
   * 返回消息
   */
  message?: string
}
