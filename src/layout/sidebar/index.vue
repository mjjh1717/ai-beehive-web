<script setup lang="ts">
import UserAvatar from './components/UserAvatar.vue'
import SideMenu from './components/SideMenu.vue'
import ThemeMode from './components/ThemeMode.vue'
import Notice from './components/Notice.vue'
</script>

<template>
  <UserAvatar />
  <SideMenu />
  <div absolute bottom-0 left-0 right-0>
    <Notice />
    <ThemeMode />
  </div>
</template>

