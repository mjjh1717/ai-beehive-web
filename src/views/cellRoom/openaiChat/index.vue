<!--
 * @Author: mjjh
 * @LastEditTime: 2023-06-09 01:16:36
 * @FilePath: \ai-beehive-web\src\views\cellRoom\openaiChat\index.vue
 * @Description:
-->
<script setup lang="ts">
import { toRefs } from 'vue'
import api from './api'
import type { RoomOpenaiChatListRequest } from './types/apiTypes'
import roomHeader from '@/components/common/roomHeader.vue'

const props = defineProps({
  // 子组件接收父组件传递过来的值
  roomData: {
    type: Object, // 数据类型
    default() {
      return {}
    },
  },
})
// 使用父组件传递过来的值
const { roomData } = toRefs(props)
const paramsData = ref<RoomOpenaiChatListRequest>({
  cursor: '',
  isUseCursor: false,
  roomId: roomData.value.roomId,
  size: 10,
  isAsc: true,
})

watch(props, (value, oldValue) => {
  roomData.value = toRefs(value)
  getRoomMessageList(toRaw(paramsData.value))
})

async function getRoomMessageList(params: RoomOpenaiChatListRequest) {
  const { data } = await api.getRoomOpenaiChatList(params)
}
getRoomMessageList(toRaw(paramsData.value))
</script>

<template>
  <div h-screen class="text-[#fff] dark:text-[#3a3a3a]" flex flex-col>
    <roomHeader :color="roomData.color" :name="roomData.name" :cell-code="roomData.cellCode" :create-time="roomData.createTime" />
    <div flex-1 p-24 class=" text-[#3a3a3a] dark:text-[#fff]">
      openaiChat
      {{ roomData }}
    </div>
    <div>
      <!-- todo NAutoComplete / 提示 -->
      <!-- v-model:value="searchValue"  -->
      <!-- :on-input="searchClick" -->
      <div p-10 flex items-center>
        <n-input
          type="textarea"
          maxlength="200" show-count size="large"
          :autosize="{ minRows: 1, maxRows: 8 }"
          placeholder="来说点啥吧....."
        />
        <n-button ml-10 size="large" type="primary" :color="`${roomData.color}`">
          <n-icon size="20">
            <icon-ri:send-plane-fill />
          </n-icon>
        </n-button>
      </div>
    </div>
  </div>
</template>
