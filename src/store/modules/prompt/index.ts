/*
 * @Author: mjjh
 * @LastEditTime: 2023-04-08 15:05:01
 * @FilePath: \chatgpt-shuowen\src\store\modules\prompt\index.ts
 * @Description: 提示词商店相关数据
 */
import { defineStore } from 'pinia'
import type { PromptStore } from './helper'
import { getLocalPromptList, setLocalPromptList } from './helper'

export const usePromptStore = defineStore('prompt-store', {
  state: (): PromptStore => getLocalPromptList(),

  actions: {
    updatePromptList(promptList: []) {
      this.$patch({ promptList })
      setLocalPromptList({ promptList })
    },
    getPromptList() {
      return this.$state
    },
  },
})
