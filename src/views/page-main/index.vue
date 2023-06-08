<script setup lang="ts">
import openaiChat from '../cellRoom/openaiChat/index.vue'
import { useRoomStore } from '@/store'
const roomStore = useRoomStore()

// 判断需要加载的房间类型
</script>

<template>
  <MainPage h-screen>
    <!--  v-if="roomStore.roomData.cellCode === 'openai_chat_api_3_5'" -->
    <openaiChat :room-data="roomStore.roomData" />
  </MainPage>
</template>
