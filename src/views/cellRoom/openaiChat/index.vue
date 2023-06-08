<script setup lang="ts">
import { toRefs } from 'vue'

const props = defineProps({
  // 子组件接收父组件传递过来的值
  roomData: {
    type: Object, // 数据类型
    default() {
      return {}
    },
  },
})
// 使用父组件传递过来的值
const { roomData } = toRefs(props)
</script>

<template>
  <div h-screen class=" text-[#fff] dark:text-[#3a3a3a]" flex flex-col>
    <div ml-10 mr-10 h-64 flex items-center :style="{ borderBottom: `1px solid ${roomData.color}` }">
      <div
        text-6xl font-600 p-10 b-rd-5 mr-10
        :style="{ backgroundColor: `${roomData.color}`, borderColor: `${roomData.color}` }"
      >
        {{ roomData.name }}
      </div>
      <div
        text-6xl font-400 p-10 b-rd-5 mr-10
        :style="{ backgroundColor: `${roomData.color}`, borderColor: `${roomData.color}` }"
      >
        {{ roomData.cellCode }}
      </div>
      <div
        text-6xl font-400 p-10 b-rd-5
        :style="{ backgroundColor: `${roomData.color}`, borderColor: `${roomData.color}` }"
      >
        {{ roomData.createTime }}
      </div>
      <div flex-1 />
      <n-button :color="`${roomData.color}`">
        <n-icon size="16">
          <icon-ri:edit-line />
        </n-icon>
        编辑
      </n-button>
    </div>
    <div flex-1 p-24 class=" text-[#3a3a3a] dark:text-[#fff]">
      openaiChat
    </div>
    <div>
      <div p-10 flex items-center>
        <!-- todo NAutoComplete / 提示 -->
        <!-- v-model:value="searchValue"  -->
        <!-- :on-input="searchClick" -->

        <n-input
          type="textarea"
          maxlength="200" show-count size="large"
          :autosize="{ minRows: 1, maxRows: 8 }"
          :style="{ border: `1px solid ${roomData.color}` }"
          placeholder="来说点啥吧....."
        />
        <n-button ml-10 size="large" type="primary" :color="`${roomData.color}`">
          <n-icon size="20">
            <icon-ri:send-plane-fill />
          </n-icon>
        </n-button>
      </div>
    </div>
  </div>
</template>
