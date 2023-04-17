<!--
 * @Author: mjjh
 * @LastEditTime: 2023-04-17 21:34:02
 * @FilePath: \chagpt-shuowen\src\views\chat\layout\login.vue
 * @Description:
-->
<script setup lang='ts'>
import { ref } from 'vue'
import type { FormInst, FormRules } from 'naive-ui'
import { NButton, NForm, NFormItem, NInput, useMessage } from 'naive-ui'
import { loginEmail } from '@/api/login'
import type { loginModel } from '@/api/login'
import { useAuthStore } from '@/store'

const authStore = useAuthStore()

const ms = useMessage()
const loading = ref(false)
// const token = ref('')

// 表单相关
const formRef = ref<FormInst | null>(null)
const userInfo = ref({
  email: '',
  passWord: '',
})

const rules: FormRules = {
  email: {
    required: true,
    trigger: ['blur', 'input'],
    validator(rule, value) {
      // 自定义验证  规则
      const regMobile = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (!value)
        return new Error('请输入邮箱')

      else if (!regMobile.test(value))
        return new Error('请输出正确邮箱格式')

      return true
    },
  },
  passWord: [
    {
      required: true,
      message: '请输入密码',
      trigger: ['input', 'blur'],
    },
  ],
}

/**
 * @description: 提交"token/secretKey"到后台校验
 */
async function handleVerify() {
  // 格式校验
  formRef.value?.validate((errors: any) => {
    if (!errors)
      pushClick()

    else ms.error('请正确填写输入框中的内容')
  })
}

async function pushClick() {
// 取值
  const pushData: loginModel = {
    username: userInfo.value.email,
    password: userInfo.value.passWord,
  }

  try {
    // 开启加载状态
    loading.value = true
    // 发起请求
    // 登录
    const { data } = await loginEmail(pushData)

    // 登录成功后 存token并且请求用户基础数据
    authStore.setToken(data?.token)

    // 成功弹框
    ms.success('success')
    // 重载页面
    window.location.reload()
  }
  catch (error: any) {
    // 错误弹框
    ms.error(error.message ?? 'error')
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
  <NForm ref="formRef" :model="userInfo" label-placement="top" :rules="rules">
    <NFormItem path="email" :label="$t('common.email')">
      <NInput v-model:value="userInfo.email" />
    </NFormItem>
    <NFormItem path="passWord" :label="$t('common.passWord')">
      <NInput v-model:value="userInfo.passWord" type="password" show-password-on="mousedown" @keypress="handlePress" />
    </NFormItem>
  </NForm>
  <NButton
    block
    type="primary"
    :loading="loading"
    @click="handleVerify"
  >
    {{ $t('common.verify') }}
  </NButton>
</template>
