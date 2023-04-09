<!--
 * @Author: mjjh
 * @LastEditTime: 2023-04-09 11:37:20
 * @FilePath: \chatgpt-shuowen\src\views\chat\layout\sider\Footer.vue
 * @Description: 侧边栏底部内容
-->
<script setup lang='ts'>
import { defineAsyncComponent, ref } from 'vue'
import { HoverButton, SvgIcon, UserAvatar } from '@/components/index'

// 设置点击打开对应窗口
const Setting = defineAsyncComponent(() => import('@/components/Setting/index.vue'))

const show = ref(false)
</script>

<template>
  <footer class="flex items-center justify-between min-w-0 p-4 overflow-hidden border-t dark:border-neutral-800">
    <div class="flex-1 flex-shrink-0 overflow-hidden">
      <UserAvatar />
    </div>

    <HoverButton @click="show = true">
      <span class="text-xl text-[#4f555e] dark:text-white">
        <SvgIcon icon="ri:settings-4-line" />
      </span>
    </HoverButton>

    <Setting v-if="show" v-model:visible="show" />
  </footer>
</template>
