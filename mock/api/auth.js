/*
 * @Author: mjjh
 * @LastEditTime: 2023-07-10 22:23:11
 * @FilePath: \ai-beehive-web\mock\api\auth.js
 * @Description:
 */
import { resolveToken } from '../utils'

export default [
  {
    url: '/api/user/login/email_',
    method: 'post',
    response: (options) => {
      const { username } = options.body
      if (['1692762315@qq.com', 'editor'].includes(username)) {
        return {
          code: 200,
          status: 'Success',
          data: {
            token: '111111111111111111111111111111111',
          },
          message: '登录成功',
        }
      }
      else {
        return {
          code: -1,
          message: '没有此用户',
        }
      }
    },
  },
  {
    url: '/api/auth/refreshToken',
    method: 'post',
    response: ({ headers }) => {
      return {
        code: 0,
        data: {
          token: resolveToken(headers?.authorization),
        },
      }
    },
  },
]
