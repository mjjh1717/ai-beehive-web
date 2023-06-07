<!--
 * @Author: mjjh
 * @LastEditTime: 2023-05-31 01:33:28
 * @FilePath: \ai-beehive-web\src\views\login\index.vue
 * @Description: 登录注册页面
-->
<script setup lang="ts">
import login from './login.vue'
import register from './register.vue'
const title: string = import.meta.env.VITE_APP_TITLE
</script>

<template>
  <!-- :style="{ backgroundImage: `url(${bgImg})` }" -->
  <AppPage :show-footer="true" bg-cover :style="{ backgroundColor: `#f5f5f5` }">
    <div m-auto p-15 f-c-c min-w-345 rounded-10 card-shadow bg-white dark:bg-dark bg-opacity-60>
      <div min-w-320 flex-col px-20 py-35>
        <h5 f-c-c text-24 font-normal color="#6a6a6a">
          {{ title }}
        </h5>
        <n-tabs
          default-value="login"
          size="large"
          animated
        >
          <n-tab-pane name="login" tab="登录">
            <login />
          </n-tab-pane>
          <n-tab-pane name="register" tab="注册">
            <register />
          </n-tab-pane>
        </n-tabs>
      </div>
    </div>
  </AppPage>
</template>

