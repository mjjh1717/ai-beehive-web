<!--
 * @Author: mjjh
 * @LastEditTime: 2023-04-17 09:48:04
 * @FilePath: \chagpt-shuowen\src\views\exception\emailValidation\index.vue
 * @Description: 邮箱验证页面
-->

<script lang="ts" setup>
import { ref } from 'vue'
import { NButton, useDialog } from 'naive-ui'
import { useRoute, useRouter } from 'vue-router'
import { isString } from '@/utils/is/index'
import { verifyEmailCode } from '@/api/register'

const loading = ref(false)
const dialog = useDialog()
const route = useRoute()
const router = useRouter()

async function confirmation() {
  try {
    // 开启加载状态
    loading.value = true
    let messageData = ''
    if (isString(route.query.verifyCode)) {
      const { message } = await verifyEmailCode(route.query.verifyCode)
      messageData = message ?? ''
    }

    // 成功弹框
    dialog.success({
      title: '校验成功!!!',
      content: messageData,
      maskClosable: false,
      closable: false,
      positiveText: '确定',
      onPositiveClick: () => {
        // 回到首页
        router.push('/')
      },
    })
  }
  catch (error) {
    // 关闭加载状态
    loading.value = false
    dialog.error({
      title: '校验失败!!!',
      content: error.message ?? 'error',
      maskClosable: false,
      closable: false,
      positiveText: '确定',
      onPositiveClick: () => {
        // 回到首页
        router.push('/')
      },
    })
  }
  finally {
    // 关闭加载状态
    loading.value = false
  }
}
</script>

<template>
  <div class="flex h-full">
    <div class="px-4 m-auto space-y-4 text-center max-[400px]">
      <h1 class="text-4xl text-slate-800 dark:text-neutral-200">
        请点击按钮确认注册
      </h1>
      <div class="flex items-center justify-center text-center">
        <div class="w-[300px]">
          <Icon403 class="w-[300px]" />
        </div>
      </div>
      <NButton :loading="loading" type="primary" @click="confirmation">
        确认
      </NButton>
    </div>
  </div>
</template>
