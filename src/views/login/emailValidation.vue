<!--
 * @Author: mjjh
 * @LastEditTime: 2023-07-14 00:24:53
 * @FilePath: \ai-beehive-web\src\views\login\emailValidation.vue
 * @Description: 邮箱验证页面
-->

<script lang="ts" setup>
import { ref } from 'vue'
import { useDialog } from 'naive-ui'
import { useRoute, useRouter } from 'vue-router'
import api from './api'
import { isString } from '~/src/utils'
import Icon403 from '@/components/icons/403.vue'
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
      const { message } = await api.verifyEmailCode(String(route.query.verifyCode))
      messageData = message
    }
    else {
      return
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
  <div flex h-full>
    <div px-4 m-auto space-y-4 text-center max-w-400px>
      <h1 text-6xl text-slate-800 dark:text-neutral-200>
        请点击按钮确认注册
      </h1>
      <div flex items-center justify-center text-center>
        <div w-300>
          <Icon403 w-300 />
        </div>
      </div>
      <n-button w-200 text-4xl :loading="loading" type="primary" @click="confirmation">
        邮箱验证
      </n-button>
    </div>
  </div>
</template>
