<!--
 * @Author: mjjh
 * @LastEditTime: 2023-06-21 00:32:10
 * @FilePath: \ai-beehive-web\src\views\page-main\index.vue
 * @Description:
-->
<script setup lang="ts">
import { toRefs } from 'vue'
import openaiChat from '../cellRoom/openaiChat/index.vue'
import openaiChatWeb from '../cellRoom/openaiChatWeb/index.vue'
import openaiImg from '../cellRoom/openaiImg/index.vue'
import newBing from '../cellRoom/newBing/index.vue'
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
      <openaiChatWeb v-if="roomStore.roomData.cellCode === 'openai_chat_web_3_5'" :key="roomStore.roomData.roomId" :room-data="roomStore.roomData" />
      <newBing v-if="roomStore.roomData.cellCode === 'new_bing'" :key="roomStore.roomData.roomId" :room-data="roomStore.roomData" />
      <openaiImg v-if="roomStore.roomData.cellCode === 'openai_image'" :key="roomStore.roomData.roomId" :room-data="roomStore.roomData" />
    </div>
  </MainPage>
</template>
