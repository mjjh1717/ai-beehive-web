<script setup lang="ts">
// import { watch } from 'vue'
import AppProvider from '@/components/common/AppProvider.vue'
// const route = useRoute()
// const router = useRouter()
// let thisRouterQuery = ref('')
// watch(route, (newVal, oldVal) => {
//   console.log('newValm', newVal.query)
//   console.log('oldVal', oldVal.query)

//   // router.go(0)
// })
</script>

<template>
  <AppProvider>
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </AppProvider>
</template>
