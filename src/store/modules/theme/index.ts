/*
 * @Author: mjjh
 * @LastEditTime: 2023-05-30 00:24:03
 * @FilePath: \ai-beehive-web\src\store\modules\theme\index.ts
 * @Description:
 */
import type { GlobalThemeOverrides } from 'naive-ui'
import { darkTheme } from 'naive-ui'
import type { BuiltInGlobalTheme } from 'naive-ui/es/themes/interface'
import { defineStore } from 'pinia'
import { getNaiveThemeOverrides, initThemeSettings } from './helpers'

type ThemeState = Theme.Setting

export const useThemeStore = defineStore('theme-store', {
  state: (): ThemeState => initThemeSettings(),
  getters: {
    naiveThemeOverrides(): GlobalThemeOverrides {
      return getNaiveThemeOverrides({ primary: this.primaryColor, ...this.otherColor })
    },
    naiveTheme(): BuiltInGlobalTheme | undefined {
      return this.darkMode ? darkTheme : undefined
    },
  },
  actions: {
    setIsMobile(isMobile: boolean) {
      this.isMobile = isMobile
    },
    /** 设置暗黑模式 */
    setDarkMode(darkMode: boolean) {
      this.darkMode = darkMode
    },
    /** 切换/关闭 暗黑模式 */
    toggleDarkMode() {
      this.darkMode = !this.darkMode
    },
    /** 切换/关闭 折叠侧边栏 */
    toggleCollapsed() {
      this.sider.collapsed = !this.sider.collapsed
    },
    /** 设置 折叠侧边栏 */
    setCollapsed(collapsed: boolean) {
      this.sider.collapsed = collapsed
    },
    /** 设置主题色 */
    setPrimaryColor(color: string) {
      this.primaryColor = color
    },
  },
})
