/*
 * @Author: mjjh
 * @LastEditTime: 2023-06-28 22:29:15
 * @FilePath: \ai-beehive-web\src\views\cellRoom\midjourney\api.ts
 * @Description: 登录注册逻辑
 */
import type { DescribeRequest, ImagineRequest, RoomMidjourneyRequest, UpscaleRequest, VariationRequest } from './types/apiTypes'
import { request } from '@/utils'

export default {
  // 获取消息列表
  getRoomMidjourneyList: (params: RoomMidjourneyRequest) => request.get('/room/midjourney/list', { params }),
  RoomMidjourneyImagine: (data: ImagineRequest) => request.post('/room/midjourney/imagine', data),
  RoomMidjourneyDescribe: (data: DescribeRequest) => request.post('/room/midjourney/describe', data),
  RoomMidjourneyUpscale: (data: UpscaleRequest) => request.post('/room/midjourney/upscale', data),
  RoomMidjourneyVariation: (data: VariationRequest) => request.post('/room/midjourney/variation', data),
}