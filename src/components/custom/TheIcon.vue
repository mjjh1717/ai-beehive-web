<script setup lang="ts">
import { renderCustomIcon, renderIcon } from '@/utils'

const props = withDefaults(defineProps<Props>(), {
  size: 14,
  color: undefined,
  type: 'iconify',
})

interface Props {
  icon: string
  size?: number
  color?: string
  /** iconify | custom */
  type?: string
}

const iconCom = computed(() =>
  props.type === 'iconify'
    ? renderIcon(props.icon, { size: props.size, color: props.color })
    : renderCustomIcon(props.icon, { size: props.size, color: props.color }),
)
</script>

<template>
  <component :is="iconCom" />
</template>
