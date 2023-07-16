/*
 * @Author: mjjh
 * @LastEditTime: 2023-07-16 18:34:58
 * @FilePath: \ai-beehive-web\src\api\index.ts
 * @Description:
 */
import { request } from '@/utils'

export default {
  getUser: () => request.get('/user/info'),
  refreshToken: () => request.post('/auth/refreshToken'),
}
