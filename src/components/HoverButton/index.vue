<!--
 * @Author: mjjh
 * @LastEditTime: 2023-04-09 15:26:49
 * @FilePath: \chagpt-shuowen\src\components\HoverButton\index.vue
 * @Description: button按钮组件
 * 可配置项: tooltip string 弹出提示
 *          placement PopoverPlacement 弹出提示的位置
-->
<script setup lang='ts'>
import { computed } from 'vue'
import type { PopoverPlacement } from 'naive-ui'
import { NTooltip } from 'naive-ui'
import Button from './Button.vue'

interface Props {
  tooltip?: string
  placement?: PopoverPlacement
}

interface Emit {
  (e: 'click'): void
}

const props = withDefaults(defineProps<Props>(), {
  tooltip: '',
  placement: 'bottom',
})

const emit = defineEmits<Emit>()

const showTooltip = computed(() => Boolean(props.tooltip))

function handleClick() {
  emit('click')
}
</script>

<template>
  <div v-if="showTooltip">
    <NTooltip :placement="placement" trigger="hover">
      <template #trigger>
        <Button @click="handleClick">
          <slot />
        </Button>
      </template>
      {{ tooltip }}
    </NTooltip>
  </div>
  <div v-else>
    <Button @click="handleClick">
      <slot />
    </Button>
  </div>
</template>
