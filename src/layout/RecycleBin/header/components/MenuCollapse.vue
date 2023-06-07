<script setup lang="ts">
import { useThemeStore } from '@/store'

const themeStore = useThemeStore()
</script>

<template>
  <n-icon size="20" cursor-pointer @click="themeStore.toggleCollapsed()">
    <icon-mdi:format-indent-increase v-if="themeStore.sider.collapsed" />
    <icon-mdi:format-indent-decrease v-else />
  </n-icon>
</template>
