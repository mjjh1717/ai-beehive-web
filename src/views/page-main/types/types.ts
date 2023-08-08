/*
 * @Author: mjjh
 * @LastEditTime: 2023-07-04 07:22:34
 * @FilePath: \ai-beehive-web\src\components\page\types\types.ts
 * @Description:
 */
/**
 * 响应结果
 */
export interface RoomResponse {
  /**
   * 状态码
   */
  code?: number
  data?: IPageRoomListVO
  /**
   * 返回消息
   */
  message?: string
}

/**
* 承载数据
*/
export interface IPageRoomListVO {
  current?: number
  pages?: number
  records?: RoomListVO[]
  size?: number
  total?: number
}

/**
* 房间列表展示对象
*/
export interface RoomListVO {
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
  roomId: number
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

/**
* cell code
*/
export enum CellCode1 {
  AliTyqw = 'ali_tyqw',
  Azure = 'Azure',
  Bard = 'Bard',
  ChatGLM = 'ChatGLM',
  Claude = 'Claude',
  Midjourney = 'Midjourney',
  NewBing = 'new_bing',
  Null = 'null',
  OpenaiChatWeb3_5 = 'openai_chat_web_3_5',
  OpenaiChatWeb4 = 'openai_chat_web_4',
  OpenaiChatapi3_5 = 'openai_chat_api_3_5',
  OpenaiChatapi4 = 'openai_chat_api_4',
  OpenaiImage = 'openai_image',
  Poe = 'poe',
  WxqfBloomz7B = 'wxqf_bloomz_7b',
  WxqfErnieBot = 'wxqf_ernie_bot',
  WxqfErnieBotTurbo = 'wxqf_ernie_bot_turbo',
}

/**
 * 编辑房间请求参数
 */
export interface editRoomVo {
  /**
   * 房间配色
   */
  color?: string
  /**
   * 房间名称
   */
  name: string
  /**
   * 房间 id
   */
  roomId: number
}

/**
 * 房间创建请求参数
 */
export interface addRoomVo {
  // id 编辑房间时候使用
  roomId?: string
  /**
   * cell code
   */
  cellCode?: CellCode2 | undefined
  /**
   * 房间配置参数列表
   */
  roomConfigParams?: RoomConfigParamRequest[] | undefined
  roomInfo?: RoomInfoRequest
}

/**
* cell code
*/
export enum CellCode2 {
  AliTyqw = 'ali_tyqw',
  Azure = 'Azure',
  Bard = 'Bard',
  ChatGLM = 'ChatGLM',
  Claude = 'Claude',
  Midjourney = 'Midjourney',
  NewBing = 'new_bing',
  Null = 'null',
  OpenaiChatWeb3_5 = 'openai_chat_web_3_5',
  OpenaiChatWeb4 = 'openai_chat_web_4',
  OpenaiChatapi3_5 = 'openai_chat_api_3_5',
  OpenaiChatapi4 = 'openai_chat_api_4',
  OpenaiImage = 'openai_image',
  Poe = 'poe',
  WxqfBloomz7B = 'wxqf_bloomz_7b',
  WxqfErnieBot = 'wxqf_ernie_bot',
  WxqfErnieBotTurbo = 'wxqf_ernie_bot_turbo',
}

/**
* 房间配置参数请求参数
*/
export interface RoomConfigParamRequest {
  /**
   * 配置项 code
   */
  cellConfigCode: string
  /**
   * 是否使用默认值
   */
  isDefaultValue: boolean
  /**
   * 配置项值
   */
  value?: string
}

/**
* 房间信息请求参数
*/
export interface RoomInfoRequest {
  /**
   * 房间配色
   */
  color?: string | undefined
  /**
   * 房间名称
   */
  name: string | undefined
}

/**
 * 响应结果
 */
export interface CellResponse {
  /**
   * 状态码
   */
  code?: number
  /**
   * 承载数据
   */
  data?: CellVO[]
  /**
   * 返回消息
   */
  message?: string
}

/**
* Cell 展示对象
*/
export interface CellVO {
  /**
   * 唯一编码
   */
  code?: Code
  /**
   * 创建时间
   */
  createTime?: Date
  /**
   * 主键
   */
  id?: number
  /**
   * 封面
   */
  imageUrl?: string
  /**
   * 是否能使用，false 否 true 是
   */
  isCanUse?: boolean
  /**
   * 介绍
   */
  introduce?: string
  /**
   * 名称
   */
  name?: string
  /**
   * 排序，值大的排前面
   */
  sort?: number
  /**
   * 状态
   */
  status?: Status
}

/**
* 唯一编码
*/
export enum Code {
  Midjourney = 'Midjourney',
  NewBing = 'new_bing',
  OpenaiChatWeb3_5 = 'openai_chat_web_3_5',
  OpenaiChatWeb4 = 'openai_chat_web_4',
  OpenaiChatapi3_5 = 'openai_chat_api_3_5',
  OpenaiChatapi4 = 'openai_chat_api_4',
  OpenaiImage = 'openai_image',
}

/**
 * 响应结果
 */
export interface CellImgResponse {
  /**
   * 状态码
   */
  code?: number
  /**
   * 承载数据
   */
  data?: CellImageVO[]
  /**
   * 返回消息
   */
  message?: string
}

/**
* Cell 封面展示对象
*/
export interface CellImageVO {
  /**
   * 编码
   */
  code?: Code
  /**
   * 封面
   */
  imageUrl?: string
}

/**
* 状态
*/
export enum Status {
  Closed = 'closed',
  Coding = 'coding',
  Fixing = 'fixing',
  Hidden = 'hidden',
  Published = 'published',
}

/**
 * 响应结果
 */
export interface CellConfigResponse {
  /**
   * 状态码
   */
  code?: number
  /**
   * 承载数据
   */
  data?: CellConfigVO[]
  /**
   * 返回消息
   */
  message?: string
}

/**
* Cell 配置项展示对象
*/
export interface CellConfigVO {
  // 编辑
  value?: string

  // 是否使用默认值
  isUseDefaultValue?: boolean

  /**
   * 配置项编码
   */
  cellConfigCode?: string
  /**
   * 默认值
   */
  defaultValue?: string
  /**
   * 示例值
   */
  exampleValue?: string
  /**
   * 介绍
   */
  introduce?: string
  /**
   * 是否有默认值，false 否 true 是
   */
  isHaveDefaultValue?: boolean
  /**
   * 是否必填，false 否 true 是
   */
  isRequired?: boolean
  /**
   * 用户创建房间后是否可修改，false 否 true 是
   */
  isUserLiveModifiable?: boolean
  /**
   * 用户是否可修改，false 否 true 是
   */
  isUserModifiable?: boolean
  /**
   * 用户是否可见默认值，false 否 true 是
   */
  isUserValueVisible?: boolean
  /**
   * 名称
   */
  name?: string
}
