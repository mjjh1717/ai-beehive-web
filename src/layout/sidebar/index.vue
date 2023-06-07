<!--
 * @Author: mjjh
 * @LastEditTime: 2023-05-30 00:31:29
 * @FilePath: \ai-beehive-web\src\layout\sidebar\index.vue
 * @Description:
-->
<script setup lang="ts">
import UserAvatar from './components/UserAvatar.vue'
import SideMenu from './components/SideMenu.vue'
import ThemeMode from './components/ThemeMode.vue'
</script>

<template>
  <UserAvatar />
  <SideMenu />
  <ThemeMode absolute bottom-0 />
</template>

