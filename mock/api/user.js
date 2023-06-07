// import { resolveToken } from '../utils'

const users = {
  admin: {
    id: 1,
    name: 'admin',
    avatar: 'https://assets.qszone.com/images/avatar.jpg',
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
