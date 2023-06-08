export interface RoomInfo {
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
