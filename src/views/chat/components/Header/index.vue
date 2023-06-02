<!--
 * @Author: mjjh
 * @LastEditTime: 2023-04-09 14:21:59
 * @FilePath: \chatgpt-shuowen\src\views\chat\components\Header\index.vue
 * @Description: 移动端的头部组件
-->
<script lang="ts" setup>
import { computed, nextTick, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { NAutoComplete, NButton, NCard, NInput, NModal } from 'naive-ui'
import { HoverButton, SvgIcon } from '@/components/index'
import { useAppStore, useChatStore, usePromptStore } from '@/store'
import { t } from '@/locales'
interface Props {
  usingContext: boolean
}

interface Emit {
  (ev: 'export'): void
  (ev: 'toggleUsingContext'): void
}

defineProps<Props>()
const emit = defineEmits<Emit>()
const route = useRoute()
const { uuid } = route.params as { uuid: string }
const appStore = useAppStore()
const chatStore = useChatStore()
const SystemRoleValue = ref<string>('')
const SystemRoleValueAsync = async () => {
  SystemRoleValue.value = await chatStore.getChatSystemRole(+uuid)
}
SystemRoleValueAsync()
const SystemRoleEdit = ref<boolean>(false)

const SystemRoleLoading = ref<boolean>(false)
const collapsed = computed(() => appStore.siderCollapsed)
const currentChatHistory = computed(() => chatStore.getChatHistoryByCurrentActive)
// 添加PromptStore
const promptStore = usePromptStore()
// 使用storeToRefs，保证store修改后，联想部分能够重新渲染
const { promptList: promptTemplate } = storeToRefs<any>(promptStore)
function handleUpdateCollapsed() {
  appStore.setSiderCollapsed(!collapsed.value)
}

function onScrollToTop() {
  const scrollRef = document.querySelector('#scrollRef')
  if (scrollRef)
    nextTick(() => scrollRef.scrollTop = 0)
}

function handleExport() {
  emit('export')
}

function toggleUsingContext() {
  emit('toggleUsingContext')
}
// 可优化部分
// 搜索选项计算，这里使用value作为索引项，所以当出现重复value时渲染异常(多项同时出现选中效果)
// 理想状态下其实应该是key作为索引项,但官方的renderOption会出现问题，所以就需要value反renderLabel实现
/**
 * @description: TODO 提示词?
 * @param {*} computed
 * @return {*}
 */
const searchSystemRoleOptions = computed(() => {
  if (SystemRoleValue.value.startsWith('/')) {
    return promptTemplate.value.filter((item: { key: string }) => item.key.toLowerCase().includes(SystemRoleValue.value.substring(1).toLowerCase())).map((obj: { value: any }) => {
      return {
        label: obj.value,
        value: obj.value,
      }
    })
  }
  else {
    return []
  }
})
// value反渲染key
const renderOption = (option: { label: string }) => {
  for (const i of promptTemplate.value) {
    if (i.value === option.label)
      return [i.key]
  }
  return []
}
/**
 * @description: 打开设置系统角色弹窗
 * @return {*}
 */
function RoleLoading() {
  SystemRoleLoading.value = !SystemRoleLoading.value

  if (SystemRoleValue.value != '')
    SystemRoleEdit.value = true
}
</script>

<template>
  <header
    class="sticky top-0 left-0 right-0 z-30 border-b dark:border-neutral-800 bg-white/80 dark:bg-black/20 backdrop-blur"
  >
    <div class="relative flex items-center justify-between min-w-0 overflow-hidden h-14">
      <div id="settingMobile" class="flex items-center">
        <button class="flex items-center justify-center w-11 h-11" @click="handleUpdateCollapsed">
          <SvgIcon v-if="collapsed" class="text-2xl" icon="ri:align-justify" />
          <SvgIcon v-else class="text-2xl" icon="ri:align-right" />
        </button>
      </div>
      <h1
        class="flex-1 px-4 pr-6 overflow-hidden cursor-pointer select-none text-ellipsis whitespace-nowrap"
        @dblclick="onScrollToTop"
      >
        {{ currentChatHistory?.title ?? '' }}
      </h1>
      <div class="flex items-center space-x-2">
        <HoverButton  @click="toggleUsingContext">
          <span class="text-xl" :class="{ 'text-[#4b9e5f]': usingContext, 'text-[#a8071a]': !usingContext }">
            <SvgIcon icon="ri:chat-history-line" />
          </span>
        </HoverButton>
        <HoverButton  @click="handleExport">
          <span class="text-xl text-[#4f555e] dark:text-white">
            <SvgIcon icon="ri:download-2-line" />
          </span>
        </HoverButton>
        <HoverButton  tooltip="设置系统角色" @click="RoleLoading">
          <span class="text-xl" :class="{ 'text-[#4b9e5f]': !SystemRoleValue, 'text-[#a8071a]': SystemRoleValue }">
            <SvgIcon icon="material-symbols:settings-account-box-sharp" />
          </span>
        </HoverButton>
      </div>
    </div>
    <NModal v-model:show="SystemRoleLoading">
      <NCard style="width: 600px" title="系统角色" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <div class="my-4">
          {{ $t('chat.systemRoleTitle') }}
        </div>
        <NAutoComplete v-model:value="SystemRoleValue" :options="searchSystemRoleOptions" :render-label="renderOption">
          <template #default="{ handleInput, handleBlur, handleFocus }">
            <NInput
              ref="inputRef" v-model:value="SystemRoleValue" type="textarea" :placeholder="t('chat.systemRoleplaceholder') "
              :disabled="SystemRoleEdit"
              :autosize="{ minRows: 1, maxRows: 4 }" style="min-height: 80px"
              @input="handleInput"
              @focus="handleFocus"
              @blur="handleBlur"
            />
          </template>
        </NAutoComplete>

        <template #footer>
          <div style="justify-content: flex-end;display: flex;">
            <div style="margin-left: 4px;">
              <NButton type="warning" @click="SystemRoleLoading = false">
                取消
              </NButton>
            </div>
            <div style="margin-left: 4px;">
              <NButton type="success" @click="RoleLoading">
                确定
              </NButton>
            </div>
          </div>
        </template>
      </NCard>
    </NModal>
  </header>
</template>
