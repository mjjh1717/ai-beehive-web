<!--
 * @Author: mjjh
 * @LastEditTime: 2023-07-05 06:43:04
 * @FilePath: \ai-beehive-web\src\views\login\emailValidation.vue
 * @Description: 邮箱验证页面
-->

<script lang="ts" setup>
import { ref } from 'vue'
import { useDialog } from 'naive-ui'
import { useRoute, useRouter } from 'vue-router'
import api from './api'
import { isString } from '~/src/utils'

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
      const { data } = await api.verifyEmailCode(String(route.query.verifyCode))
      messageData = data.message ?? ''
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
      <h1 class="text-4xl text-slate-800 dark:text-neutral-200">
        请点击按钮确认注册
      </h1>
      <div flex items-center justify-center text-center>
        <!-- <div class="w-[300px]">
          <Icon403 class="w-[300px]" />
        </div> -->
      </div>
      <n-button :loading="loading" type="primary" @click="confirmation">
        确认
      </n-button>
    </div>
  </div>
</template>
