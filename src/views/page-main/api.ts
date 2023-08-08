/*
 * @Author: mjjh
 * @LastEditTime: 2023-07-04 07:21:48
 * @FilePath: \ai-beehive-web\src\components\page\api.ts
 * @Description:
 */
import type { getRoomPage } from './types/apiTypes'
import type { addRoomVo, editRoomVo } from './types/types'
import { request } from '@/utils'
export default {
  // 获取消息列表数据
  getRoomPage: (params: getRoomPage) => request.get('/room/page', { params }),
  updateRoom: (data: editRoomVo) => request.post('/room/edit', {
    color: data.color,
    name: data.name,
    roomId: data.roomId,
  }),
  deleteRoom: (roomId: number) => request.delete(`/room/delete?roomId=${roomId}`),

  addRoom: (data: addRoomVo) => request.post('/room/create', data),
  getCellList: () => request.get('/cell/list'),
  getCellImgList: () => request.get('/cell/list_image'),
  getCellConfigList: (cellCode: string) => request.get(`/cell_config/list?cellCode=${cellCode}`),

  // 获取房间配置
  getRoomConfig: (roomId: string) => request.get(`/room_config_param/list?roomId=${roomId}`),
  editRoomConfig: (data: addRoomVo) => request.post('/room_config_param/edit', data),
}
