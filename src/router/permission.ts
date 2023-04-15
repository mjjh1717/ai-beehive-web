/*
 * @Author: mjjh
 * @LastEditTime: 2023-04-15 21:45:15
 * @FilePath: \chatgpt-shuowen\src\router\permission.ts
 * @Description: 路由导航守卫(鉴权) todo
 */
import type { Router } from 'vue-router'
import { useAuthStoreWithout } from '@/store/modules/auth'

export function setupPageGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStoreWithout()
    if (!authStore.token) {
      if (to.path === '/500')
        next({ name: 'Root' })
      else
        next()
    }
    else {
      next()
    }
  })
}
