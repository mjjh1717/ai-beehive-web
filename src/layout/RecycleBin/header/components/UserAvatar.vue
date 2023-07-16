<!--
 * @Author: mjjh
 * @LastEditTime: 2023-07-16 18:40:20
 * @FilePath: \ai-beehive-web\src\layout\RecycleBin\header\components\UserAvatar.vue
 * @Description:
-->
<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { useUserStore } from '@/store'
import { renderIcon } from '@/utils'

const ms = useMessage()
const userStore = useUserStore()

const options = [
  {
    label: '退出登录',
    key: 'logout',
    icon: renderIcon('mdi:exit-to-app', { size: 14 }),
  },
]

function handleSelect(key: string) {
  if (key === 'logout') {
    window.$dialog?.info({
      content: '确认退出？',
      title: '提示',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick() {
        userStore.logout()
        ms.success('已退出登录!')
        // console.log('window.$message?.success', window.$message?.success)
        // window.$message?.success('已退出登录!', { duration: 5000 })
      },
    })
  }
}
</script>

<template>
  <n-dropdown :options="options" @select="handleSelect">
    <div flex items-center cursor-pointer>
      <img :src="userStore.avatarUrl ?? 'https://img1.imgtp.com/2023/07/12/MBpt152Z.png'" mr10 w-35 h-35 rounded-full>
      <span hidden sm:block>{{ userStore.nickname }}</span>
    </div>
  </n-dropdown>
</template>
