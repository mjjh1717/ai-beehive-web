/*
 * @Author: mjjh
 * @LastEditTime: 2023-04-08 15:15:27
 * @FilePath: \chatgpt-shuowen\src\store\index.ts
 * @Description: 使用pinia
 */
import type { App } from 'vue'
import { createPinia } from 'pinia'

export const store = createPinia()

export function setupStore(app: App) {
  app.use(store)
}

export * from './modules'
