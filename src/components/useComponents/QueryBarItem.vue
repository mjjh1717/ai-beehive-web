<script setup>
import { useThemeStore } from '@/store'
defineProps({
  label: {
    type: String,
    default: '',
  },
  labelWidth: {
    type: Number,
    default: 80,
  },
  contentWidth: {
    type: Number,
    default: 220,
  },
})
const themeStore = useThemeStore()
</script>

<template>
  <div flex items-center>
    <label v-if="label || label === 0" w-80 flex-shrink-0 :style="{ width: `${labelWidth}px` }">
      {{ label }}
    </label>
    <div :style="{ width: `${themeStore.isMobile ? 180 : contentWidth}px` }" flex-shrink-0>
      <slot />
    </div>
  </div>
</template>
