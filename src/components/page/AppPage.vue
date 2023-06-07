<script setup lang="ts">
interface Props {
  showFooter?: boolean
}
withDefaults(defineProps<Props>(), {
  showFooter: false,
})
</script>

<template>
  <transition name="fade-slide" mode="out-in" appear>
    <section class="cus-scroll-y wh-full p-15 flex-col bg-[#f5f6fb]" dark:bg-hex-121212>
      <slot />
      <AppFooter v-if="showFooter" mt-15 />
    </section>
  </transition>
</template>
