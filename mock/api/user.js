/*
 * @Author: mjjh
 * @LastEditTime: 2023-07-14 09:38:57
 * @FilePath: \ai-beehive-web\mock\api\user.js
 * @Description:
 */
// import { resolveToken } from '../utils'

const users = {
  admin: {
    id: 1,
    name: 'admin',
    avatar: 'https://img1.imgtp.com/2023/07/12/MBpt152Z.png',
    email: 'Ronnie@123.com',
    role: ['admin'],
  },
}
export default [
  {
    url: '/api/user',
    method: 'get',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    response: ({ headers }) => {
      // const token = resolveToken(headers?.authorization)
      return {
        code: 200,
        data: {
          ...(users.admin || users.guest),
        },
      }
    },
  },
]
