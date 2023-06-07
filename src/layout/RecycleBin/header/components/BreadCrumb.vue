<script setup lang="ts">
import { renderCustomIcon, renderIcon } from '@/utils'
import type { Meta } from '~/types/router'

const router = useRouter()
const route = useRoute()

function handleBreadClick(path: string) {
  if (path === route.path)
    return
  router.push(path)
}

function getIcon(meta?: Meta, size = 16) {
  if (meta?.customIcon)
    return renderCustomIcon(meta.customIcon, { size })
  if (meta?.icon)
    return renderIcon(meta.icon, { size })
  return null
}
</script>

<template>
  <n-breadcrumb>
    <n-breadcrumb-item v-for="item in route.matched.filter(item => !!item.meta?.title)" :key="item.path" @click="handleBreadClick(item.path)">
      <component :is="getIcon(item.meta)" />
      {{ item.meta.title }}
    </n-breadcrumb-item>
  </n-breadcrumb>
</template>
