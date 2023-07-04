<script setup lang="ts">
import { useAppStore } from '@/store'
const appStore = useAppStore()
</script>

<template>
  <router-view v-slot="{ Component }">
    <!-- route :key="route.path" -->
    <component :is="Component" v-if="appStore.reloadFlag" />
  </router-view>
</template>
