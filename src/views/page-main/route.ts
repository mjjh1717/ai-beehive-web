/*
 * @Author: mjjh
 * @LastEditTime: 2023-07-25 23:26:19
 * @FilePath: \chatgpt-shuowen\src\views\page-main\route.ts
 * @Description:
 */
import type { RouteType } from '~/types/router'
const Layout = () => import('@/layout/index.vue')

export default {
  name: 'main',
  path: '/',
  component: Layout,
  redirect: '/main',
  meta: {
    order: 0,
  },
  children: [
    {
      name: 'index',
      path: 'main',
      component: () => import('./index.vue'),
      meta: {
        title: '大别野',
        name: 'index',
        icon: 'fxemoji:bank',
        routerViewKey: 'main-page',
      },
      children: [
        {
          name: 'Midjourney',
          path: 'midjourney',
          isHidden: true,
          component: () => import('../cellRoom/midjourney/index.vue'),
          meta: {
            routerViewKey: 'main-page',
          },
        },
        {
          name: 'new_bing',
          path: 'newBing',
          isHidden: true,
          component: () => import('../cellRoom/newBing/index.vue'),
          meta: {
            routerViewKey: 'main-page',
          },
        },
        {
          name: 'openai_chat_api_3_5',
          path: 'openaiChat',
          isHidden: true,
          component: () => import('../cellRoom/openaiChat/index.vue'),
          meta: {
            routerViewKey: 'main-page',
          },
        },
        {
          name: 'openai_chat_api_4',
          path: 'openaiChat',
          isHidden: true,
          component: () => import('../cellRoom/openaiChat/index.vue'),
          meta: {
            routerViewKey: 'main-page',
          },
        },
        {
          name: 'openai_chat_web_3_5',
          path: 'openaiChatWeb',
          isHidden: true,
          component: () => import('../cellRoom/openaiChatWeb/index.vue'),
          meta: {
            routerViewKey: 'main-page',
          },
        },
        {
          name: 'openai_chat_web_4',
          path: 'openaiChatWeb',
          isHidden: true,
          component: () => import('../cellRoom/openaiChatWeb/index.vue'),
          meta: {
            routerViewKey: 'main-page',
          },
        },
        {
          name: 'openai_image',
          path: 'openaiImg',
          isHidden: true,
          component: () => import('../cellRoom/openaiImg/index.vue'),
          meta: {
            routerViewKey: 'main-page',
          },
        },
        {
          name: 'wxqf_bloomz_7b',
          path: 'wyqfChat',
          isHidden: true,
          component: () => import('../cellRoom/wyqfChat/index.vue'),
          meta: {
            routerViewKey: 'main-page',
          },
        },
        {
          name: 'wxqf_ernie_bot',
          path: 'wyqfChat',
          isHidden: true,
          component: () => import('../cellRoom/wyqfChat/index.vue'),
          meta: {
            routerViewKey: 'main-page',
          },
        },
        {
          name: 'wxqf_ernie_bot_turbo',
          path: 'wyqfChat',
          isHidden: true,
          component: () => import('../cellRoom/wyqfChat/index.vue'),
          meta: {
            routerViewKey: 'main-page',
          },
        },
      ],
    },
  ],
} as unknown as RouteType
