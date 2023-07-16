/*
 * @Author: mjjh
 * @LastEditTime: 2023-07-16 18:36:16
 * @FilePath: \ai-beehive-web\src\store\modules\user\index.ts
 * @Description:
 */
/*
 * @Author: mjjh
 * @LastEditTime: 2023-07-16 18:34:43
 * @FilePath: \ai-beehive-web\src\store\modules\user\index.ts
 * @Description:
 */
import { defineStore } from 'pinia'
import { removeToken, toLogin } from '@/utils'
import { usePermissionStore, useTabStore } from '@/store'
import { resetRouter } from '@/router'
import api from '@/api'

interface UserInfo {
  baseUserId?: string
  nickname?: string
  status?: string
  email?: string
  description?: string
  avatarUrl?: string
  role?: Array<string>
}

export const useUserStore = defineStore('user', {
  state() {
    return {
      userInfo: <UserInfo> {},
    }
  },
  getters: {
    baseUserId(): string {
      return this.userInfo.baseUserId || ''
    },
    nickname(): string {
      return this.userInfo.nickname || ''
    },
    status(): string {
      return this.userInfo.status || ''
    },
    email(): string {
      return this.userInfo.email || ''
    },
    description(): string {
      return this.userInfo.description || ''
    },
    avatarUrl(): string {
      return this.userInfo.avatarUrl || ''
    },
    role(): Array<string> {
      return this.userInfo.role || []
    },
  },
  actions: {
    // TODO mock人员数据
    async getUserInfo() {
      try {
        const res: any = await api.getUser()
        if (res.code === 200) {
          const { baseUserId, nickname, status, email, description, avatarUrl } = res.data
          this.userInfo = { baseUserId, nickname, status, email, description, avatarUrl }
          return Promise.resolve(res.data)
        }
        else {
          return Promise.reject(res)
        }
      }
      catch (error) {
        return Promise.reject(error)
      }
    },
    async logout() {
      const { resetTabs } = useTabStore()
      const { resetPermission } = usePermissionStore()
      removeToken()
      resetPermission()
      resetTabs()
      resetRouter()
      this.$reset()
      toLogin()
    },
    setUserInfo(userInfo = {}) {
      this.userInfo = { ...this.userInfo, ...userInfo }
    },
  },
})
