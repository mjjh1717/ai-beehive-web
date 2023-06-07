<script setup>
import { computed } from 'vue'
import { NButton, NModal } from 'naive-ui'

const props = defineProps({
  width: {
    type: String,
    default: '600px',
  },
  title: {
    type: String,
    default: '',
  },
  showFooter: {
    type: Boolean,
    default: true,
  },
  visible: {
    type: Boolean,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:visible', 'onSave'])
const show = computed({
  get() {
    return props.visible
  },
  set(v) {
    emit('update:visible', v)
  },
})
</script>

<template>
  <NModal v-model:show="show" :style="{ width }" preset="card" :title="title" size="huge" :bordered="false">
    <slot />
    <template v-if="showFooter" #footer>
      <footer flex justify-end>
        <slot name="footer">
          <NButton @click="show = false">
            取消
          </NButton>
          <NButton :loading="loading" ml-20 type="primary" @click="emit('onSave')">
            保存
          </NButton>
        </slot>
      </footer>
    </template>
  </NModal>
</template>
