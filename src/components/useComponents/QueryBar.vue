<script setup>
import { NButton, NSpace } from 'naive-ui'
import { useThemeStore } from '@/store'
const emit = defineEmits(['search', 'reset'])
const themeStore = useThemeStore()
</script>

<template>
  <div min-h-60 p-15 flex items-start justify-between b-1 bc-ccc rounded-8 bg="#fafafc" dark:bg-black>
    <NSpace wrap :size="[35, 15]">
      <slot />
      <div v-if="themeStore.isMobile ">
        <NButton secondary type="primary" @click="emit('reset')">
          重置
        </NButton>
        <NButton ml-20 type="primary" @click="emit('search')">
          搜索
        </NButton>
      </div>
    </NSpace>
    <div v-if="!themeStore.isMobile " flex-shrink-0>
      <NButton secondary type="primary" @click="emit('reset')">
        重置
      </NButton>
      <NButton ml-20 type="primary" @click="emit('search')">
        搜索
      </NButton>
    </div>
  </div>
</template>
