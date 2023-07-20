<script setup lang="ts">
import AppProvider from '@/components/common/AppProvider.vue'
import 'md-editor-v3/lib/style.css'
</script>

<template>
  <AppProvider>
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </AppProvider>
</template>
