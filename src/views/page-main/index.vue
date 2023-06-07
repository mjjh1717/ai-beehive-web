<!--
 * @Author: mjjh
 * @LastEditTime: 2023-06-07 00:29:34
 * @FilePath: \ai-beehive-web\src\views\page-main\index.vue
 * @Description:
-->
<script setup lang="ts">
import { useRoomStore } from '@/store'
const roomStore = useRoomStore()
</script>

<template>
  <MainPage min-w-375>
    我是聊天室内容{{ roomStore.roomData }}
  </MainPage>
</template>
