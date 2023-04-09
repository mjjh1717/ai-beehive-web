<!--
 * @Author: mjjh
 * @LastEditTime: 2023-04-09 10:52:52
 * @FilePath: \chatgpt-shuowen\src\views\chat\layout\Permission.vue
 * @Description:
-->
<script setup lang='ts'>
import { computed, ref } from 'vue'
import { NButton, NInput, NModal, useMessage } from 'naive-ui'
import { fetchVerify } from '@/api'
import { useAuthStore } from '@/store'
import Icon403 from '@/icons/403.vue'

interface Props {
  visible: boolean
}

defineProps<Props>()

const authStore = useAuthStore()

const ms = useMessage()

const loading = ref(false)
const token = ref('')

const disabled = computed(() => !token.value.trim() || loading.value)
/**
 * @description: 提交"token/secretKey"到后台校验
 */
async function handleVerify() {
  // 取值
  const secretKey = token.value.trim()

  // 判断是否有输入
  if (!secretKey)
    return

  try {
    // 开启加载状态
    loading.value = true
    // 发起请求
    await fetchVerify(secretKey)
    // 加入缓存
    authStore.setToken(secretKey)
    // 成功弹框
    ms.success('success')
    // 重载页面
    window.location.reload()
  }
  catch (error: any) {
    // 错误弹框
    ms.error(error.message ?? 'error')
    // 清空token缓存
    authStore.removeToken()
    // 清空本文件缓存
    token.value = ''
  }
  finally {
    // 关闭加载状态
    loading.value = false
  }
}

/**
 * @description: 监听键盘Enter事件
 * @param {*} event
 */
function handlePress(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleVerify()
  }
}
</script>

<template>
  <NModal :show="visible" style="width: 90%; max-width: 640px">
    <div class="p-10 bg-white rounded dark:bg-slate-800">
      <div class="space-y-4">
        <header class="space-y-2">
          <h2 class="text-2xl font-bold text-center text-slate-800 dark:text-neutral-200">
            403
          </h2>
          <p class="text-base text-center text-slate-500 dark:text-slate-500">
            {{ $t('common.unauthorizedTips') }}
          </p>
          <Icon403 class="w-[200px] m-auto" />
        </header>
        <NInput v-model:value="token" type="password" placeholder="" @keypress="handlePress" />
        <NButton
          block
          type="primary"
          :disabled="disabled"
          :loading="loading"
          @click="handleVerify"
        >
          {{ $t('common.verify') }}
        </NButton>
      </div>
    </div>
  </NModal>
</template>
