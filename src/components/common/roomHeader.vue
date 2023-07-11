<!--
 * @Author: mjjh
 * @LastEditTime: 2023-07-12 00:39:49
 * @FilePath: \ai-beehive-web\src\components\common\roomHeader.vue
 * @Description:
-->
<script setup lang="ts">
interface Props {
  /** 图标名称(图片的文件名) */
  color: string
  name: string
  cellCode: string
  createTime: string
}
const props = withDefaults(defineProps<Props>(), {})

// todo 编辑按钮未绑定
</script>

<template>
  <div ml-10 mr-10 h-64 flex items-center :style="{ boxShadow: `rgba(17, 17, 26, 0.1) 0px 1px 0px` }">
    <!-- :style="{ backgroundColor: `${props.color}`, borderColor: `${props.color}` }" -->
    <div
      text-6xl font-400 p-10 b-rd-5 mr-10 flex items-center
    >
      <n-icon size="20" color="#ffad0a" mr-4>
        <icon-material-symbols:house />
      </n-icon>
      {{ props.name }}
    </div>
    <div
      text-6xl font-400 p-10 b-rd-5 mr-10 flex items-center
    >
      <n-icon size="20" color="#ffad0a" mr-4>
        <icon-material-symbols:bookmarks />
      </n-icon>
      {{ props.cellCode }}
    </div>
    <div
      text-6xl font-400 p-10 b-rd-5 flex items-center
    >
      <n-icon size="20" color="#ffad0a" mr-4>
        <icon-material-symbols:date-range />
      </n-icon>
      {{ props.createTime }}
    </div>
    <div flex-1 />
    <!-- :color="`${props.color}`" -->
    <!-- <n-button type="primary">
      <n-icon size="16">
        <icon-ri:edit-line />
      </n-icon>
      编辑
    </n-button> -->
  </div>
</template>
