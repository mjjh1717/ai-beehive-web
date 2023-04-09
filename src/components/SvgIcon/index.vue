<!--
 * @Author: mjjh
 * @LastEditTime: 2023-04-09 15:26:59
 * @FilePath: \chagpt-shuowen\src\components\SvgIcon\index.vue
 * @Description: svg组件
 * 可配置项 icon string | IconifyIcon 图标
-->
<script setup lang='ts'>
import { computed, useAttrs } from 'vue'
import { Icon } from '@iconify/vue'

interface Props {
  icon?: string
}

defineProps<Props>()

const attrs = useAttrs()

const bindAttrs = computed<{ class: string; style: string }>(() => ({
  class: (attrs.class as string) || '',
  style: (attrs.style as string) || '',
}))
</script>

<template>
  <Icon :icon="icon" v-bind="bindAttrs" />
</template>
