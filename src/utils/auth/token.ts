import { getLocal, getLocalExpire, removeLocal, setLocal } from '@/utils'
import api from '@/api'

const TOKEN_CODE = 'access_token'
/** token过期时间：6小时 */
const DURATION = 6 * 60 * 60

export function getToken() {
  return getLocal(TOKEN_CODE)
}

export function setToken(token: string) {
  setLocal(TOKEN_CODE, token, DURATION)
}

export function removeToken() {
  removeLocal(TOKEN_CODE)
}

export async function refreshAccessToken() {
  const expire: number | null = getLocalExpire(TOKEN_CODE)

  // * token没有过期时间或者token离过期时间超过30分钟则不执行刷新
  if (!expire || expire - new Date().getTime() > 1000 * 60 * 30)
    return

  try {
    const res: any = await api.refreshToken()
    if (res.code === 0)
      setToken(res.data.token)
  }
  catch {
    // 无感刷新，有异常也不提示
  }
}
