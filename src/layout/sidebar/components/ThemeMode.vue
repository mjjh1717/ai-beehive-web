<!--
 * @Author: mjjh
 * @LastEditTime: 2023-05-30 00:32:20
 * @FilePath: \ai-beehive-web\src\layout\sidebar\components\ThemeMode.vue
 * @Description:
-->
<script lang="ts" setup>
import { useThemeStore } from '@/store'

const theme = useThemeStore()
</script>

<template>
  <div flex items-center justify-center mt-10 mb-10 cursor-pointer w-full>
    <n-icon size="28" @click="theme.toggleDarkMode">
      <icon-mdi-moon-waning-crescent v-if="theme.darkMode" />
      <icon-mdi-white-balance-sunny v-else />
    </n-icon>
  </div>
</template>
