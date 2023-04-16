/*
 * @Author: mjjh
 * @LastEditTime: 2023-04-15 23:27:47
 * @FilePath: \chatgpt-shuowen\src\store\modules\auth\index.ts
 * @Description: 存储用户数据
 */
import { defineStore } from 'pinia'
import { getToken, removeToken, setToken } from './helper'
import { store } from '@/store'

export interface AuthState {
  token: string | undefined
}

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => ({
    token: getToken(),
  }),

  actions: {

    setToken(token: string) {
      this.token = token
      setToken(token)
    },

    removeToken() {
      this.token = undefined
      removeToken()
    },
  },
})

export function useAuthStoreWithout() {
  return useAuthStore(store)
}
