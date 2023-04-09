/*
 * @Author: mjjh
 * @LastEditTime: 2023-04-09 15:27:08
 * @FilePath: \chagpt-shuowen\src\hooks\useLanguage.ts
 * @Description: 国际化
 */
import { computed } from 'vue'
import { enUS, zhCN, zhTW } from 'naive-ui'
import { useAppStore } from '@/store'
import { setLocale } from '@/locales'

export function useLanguage() {
  const appStore = useAppStore()

  const language = computed(() => {
    switch (appStore.language) {
      case 'en-US':
        setLocale('en-US')
        return enUS
      case 'zh-CN':
        setLocale('zh-CN')
        return zhCN
      case 'zh-TW':
        setLocale('zh-TW')
        return zhTW
      default:
        setLocale('zh-CN')
        return enUS
    }
  })

  return { language }
}
