<script setup lang="ts">
import { useUserStore } from '@/store'
import { renderIcon } from '@/utils'

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
        window.$message?.success('已退出登录!')
      },
    })
  }
}
</script>

<template>
  <n-dropdown :options="options" @select="handleSelect">
    <div flex items-center cursor-pointer>
      <img :src="userStore.avatar" mr10 w-35 h-35 rounded-full>
      <span hidden sm:block>{{ userStore.name }}</span>
    </div>
  </n-dropdown>
</template>
