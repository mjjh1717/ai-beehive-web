<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { useMessage } from 'naive-ui'
import type { FormInst, FormRules } from 'naive-ui'
import api from './api'
import type { loginModel } from './types/apiTypes'
import { getLocal, removeLocal, setLocal, setToken } from '@/utils'
import { addDynamicRoutes } from '@/router'

const router = useRouter()
const route = useRoute()
const query = route.query
const formRef = ref<FormInst | null>(null)
const ms = useMessage()
const rules: FormRules = {
  username: {
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
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: ['input', 'blur'],
    },
  ],
}

const loginInfo = ref<loginModel>({
  username: '',
  password: '',
})

const localLoginInfo = getLocal('loginInfo') as loginModel
if (localLoginInfo) {
  loginInfo.value.username = localLoginInfo.username || ''
  loginInfo.value.password = localLoginInfo.password || ''
}

const loging = ref<boolean>(false)
const isRemember = useStorage('isRemember', false)
async function handleLogin() {
  formRef.value?.validate(async (errors: any) => {
    if (!errors) {
      const { username, password } = loginInfo.value
      if (!username || !password) {
        ms.warning('请输入用户名和密码')
        return
      }
      try {
        loging.value = true
        const res: any = await api.login({ username, password: password.toString() })

        // 存token
        setToken(res.data.token)
        // 存用户账户吗密码
        if (isRemember.value)
          setLocal('loginInfo', { username, password })
        else
          removeLocal('loginInfo')

        // 添加路由操作
        await addDynamicRoutes()
        if (query.redirect) {
          const path = query.redirect as string
          Reflect.deleteProperty(query, 'redirect')
          router.push({ path, query })
        }
        else {
          router.push('/')
        }
      }
      catch (error) {
        console.error(error)
      }
      loging.value = false
    }

    else { ms.error('请正确填写输入框中的内容') }
  })
}
/**
 * @description: 监听键盘Enter事件
 * @param {*} event
 */
function handlePress(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleLogin()
  }
}
</script>

<template>
  <n-form ref="formRef" :model="loginInfo" label-placement="top" :rules="rules">
    <n-formItem path="username" label="邮箱">
      <n-input v-model:value="loginInfo.username" placeholder="请输入邮箱" />
    </n-formItem>
    <n-formItem path="password" label="密码">
      <n-input v-model:value="loginInfo.password" type="password" show-password-on="mousedown" placeholder="请输入密码" @keypress="handlePress" />
    </n-formItem>
  </n-form>
  <n-button
    block
    type="primary"
    :loading="loging"
    @click="handleLogin"
  >
    登录
  </n-button>
</template>

