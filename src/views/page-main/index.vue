<!--
 * @Author: mjjh
 * @LastEditTime: 2023-06-11 23:50:27
 * @FilePath: \ai-beehive-web\src\views\page-main\index.vue
 * @Description:
-->
<script setup lang="ts">
import { toRefs } from 'vue'
import openaiChat from '../cellRoom/openaiChat/index.vue'
import { useRoomStore } from '@/store'
import { isEmpty } from '@/utils/common/index'

const roomStore = useRoomStore()
const { roomData } = toRefs(roomStore)
// 判断需要加载的房间类型
</script>

<template>
  <MainPage h-screen>
    <div v-if="isEmpty(roomData) ">
      请选择房间
    </div>
    <!--  v-if="roomStore.roomData.cellCode === 'openai_chat_api_3_5'" -->
    <div v-else>
      <openaiChat v-if="roomStore.roomData.cellCode === 'openai_chat_api_3_5'" :key="roomStore.roomData.roomId" :room-data="roomStore.roomData" />
    </div>
  </MainPage>
</template>
