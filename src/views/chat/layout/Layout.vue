<!--
 * @Author: mjjh
 * @LastEditTime: 2023-04-15 22:10:36
 * @FilePath: \chatgpt-shuowen\src\views\chat\layout\Layout.vue
 * @Description: 页面布局文件
-->
<script setup lang='ts'>
import { computed } from 'vue'
import { NLayout, NLayoutContent, NModal, NTabPane, NTabs } from 'naive-ui'
import { useRouter } from 'vue-router'
import Sider from './sider/index.vue'
import login from './login.vue'
import register from './register.vue'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { useAppStore, useAuthStore, useChatStore, useUserStore } from '@/store'

const router = useRouter()
const appStore = useAppStore()
const chatStore = useChatStore()
const authStore = useAuthStore()
const userStore = useUserStore()

router.replace({ name: 'Chat', params: { uuid: chatStore.active } })

const { isMobile } = useBasicLayout()

const collapsed = computed(() => appStore.siderCollapsed)

const needPermission = computed(() => !authStore.token)

// 获取屏幕尺寸适配移动端
const getMobileClass = computed(() => {
  if (isMobile.value)
    return ['rounded-none', 'shadow-none']
  return ['border', 'rounded-md', 'shadow-md', 'dark:border-neutral-800']
})

const getContainerClass = computed(() => {
  return [
    'h-full',
    { 'pl-[260px]': !isMobile.value && !collapsed.value },
  ]
})

// 页面加载请求用户信息
if (!needPermission.value)
  userStore.getUserData()
</script>

<template>
  <div class="h-full dark:bg-[#24272e] transition-all" :class="[isMobile ? 'p-0' : 'p-4']">
    <div class="h-full overflow-hidden" :class="getMobileClass">
      <NLayout class="z-40 transition" :class="getContainerClass" has-sider>
        <Sider />
        <NLayoutContent class="h-full">
          <RouterView v-slot="{ Component, route }">
            <component :is="Component" :key="route.fullPath" />
          </RouterView>
        </NLayoutContent>
      </NLayout>
    </div>
    <NModal :show="needPermission" style="width: 90%; max-width: 640px">
      <div class="p-10 bg-white rounded dark:bg-slate-800">
        <div class="space-y-4">
          <NTabs default-value="login" size="large" animated>
            <NTabPane name="login" tab="登录">
              <login />
            </NTabPane>
            <NTabPane name="register" tab="注册">
              <register />
            </NTabPane>
          </NTabs>
        </div>
      </div>
    </NModal>
  </div>
</template>
