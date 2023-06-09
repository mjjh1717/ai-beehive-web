/*
 * @Author: mjjh
 * @LastEditTime: 2023-05-30 00:42:54
 * @FilePath: \ai-beehive-web\src\views\page-main\route.ts
 * @Description:
 */
import type { RouteType } from '~/types/router'
const Layout = () => import('@/layout/index.vue')

export default {
  name: 'pageMain',
  path: '/',
  component: Layout,
  redirect: '/pageMain',
  meta: {
    order: 0,
  },
  children: [
    {
      name: 'PageMainIndex',
      path: 'pageMain',
      component: () => import('./index.vue'),
      meta: {
        title: '大别野',
        icon: 'fxemoji:bank',
      },
    },
  ],
} as RouteType
