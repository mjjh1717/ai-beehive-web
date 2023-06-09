/*
 * @Author: mjjh
 * @LastEditTime: 2023-05-28 22:44:14
 * @FilePath: \ai-beehive-web\src\views\login\api.ts
 * @Description: 登录注册逻辑
 */
import type { loginModel, registerModel } from './types/apiTypes'
import { request } from '@/utils'
import type { RequestConfig } from '~/types/axios'

export default {
  // 登录接口
  login: (data: loginModel) => request.post('/user/login/email', data, { noNeedToken: true } as RequestConfig),
  // 邮箱注册接口
  registerEmail: (data: registerModel) => request.post('/user/register/email', data, { noNeedToken: true } as RequestConfig),
  // 获取图片验证码
  getPicCode: () => request.get('/user/get_pic_code', { noNeedToken: true } as RequestConfig),
  // 邮件验证回调验证码
  verifyEmailCode: (code: string) => request.get(`/user/verify_email_code?code=${code}`),
}
