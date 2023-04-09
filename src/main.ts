/*
 * @Author: mjjh
 * @LastEditTime: 2023-04-09 15:26:43
 * @FilePath: \chagpt-shuowen\src\main.ts
 * @Description: main文件 配置项目
 */
import { createApp } from 'vue'
import App from './App.vue'
import { setupI18n } from './locales'
import { setupAssets, setupScrollbarStyle } from './plugins'
import { setupStore } from './store'
import { setupRouter } from './router'

async function setupApp() {
  const app = createApp(App)
  // setupAssets 样式文件
  setupAssets()

  // setupScrollbarStyle 滚动条
  setupScrollbarStyle()

  // setupI18n 国际化插件
  setupI18n(app)

  // setupStore 使用pinia
  setupStore(app)

  // setupRouter 使用路由
  await setupRouter(app)

  app.mount('#app')
}

setupApp()
