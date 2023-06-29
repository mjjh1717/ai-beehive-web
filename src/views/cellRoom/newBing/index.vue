<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { onMounted, onUnmounted, toRefs } from 'vue'
import { useMessage } from 'naive-ui'
import api from './api'
import type { RoomNewBingListRequest, RoomNewBingMsgVO, sendRequest } from './types/apiTypes'
import roomHeader from '@/components/common/roomHeader.vue'
import { useRoomStore } from '@/store'
const props = defineProps({
  // 子组件接收父组件传递过来的值
  roomData: {
    type: Object, // 数据类型
    default() {
      return {}
    },
  },
})
onUnmounted(() => {
  api.handleStop()
})
const roomStore = useRoomStore()

const ms = useMessage()

// 使用父组件传递过来的值
const { roomData } = toRefs(props)
const paramsData = ref<RoomNewBingListRequest>({
  cursor: '',
  isUseCursor: false,
  roomId: roomData.value.roomId,
  size: 10,
  isAsc: false,
})
const getMore = ref(false)
const messageScrollbar = ref()
const messageList = ref <RoomNewBingMsgVO[]>(roomStore.messageListData)
const firstGetListType = ref(roomStore.messageListData.length === 0)

watch(props, (value, oldValue) => {
  roomData.value = toRefs(value)
  getRoomMessageList(toRaw(paramsData.value))
})

watch(messageList, (value, oldValue) => {
  if (value.length > 0) {
    // messageList不为空则存入本地数据中
    roomStore.setlocaMessageList(value)
  }
})

async function getRoomMessageList(params: RoomNewBingListRequest) {
  const { data } = await api.getRoomNewBingList(params)

  if (data.length > 0) {
    const oldList = toRaw(messageList.value)
    messageList.value = []
    messageList.value.push(...data.reverse(), ...oldList)
    paramsData.value.isUseCursor = true
    paramsData.value.cursor = data[0].id
  }
  if (data.length === 10)
    getMore.value = true

  if (data.length < 10 && getMore.value) {
    ms.warning('没有更多数据哩!!!')
    getMore.value = false
  }

  // 以id为标识符,存到对应的浏览器缓存中
}
// getRoomMessageList(toRaw(paramsData.value))

function loadingMore() {
  if (firstGetListType.value) {
    getRoomMessageList(toRaw(paramsData.value))
  }
  else {
    firstGetListType.value = true
    getNewData()
    return
  }

  messageScrollbar.value.scrollTo({ top: 10 })
}

onMounted(() => {
  loadingMore()
  messageScrollbar.value.scrollTo({ top: 999999999 })
})

// 获取滚动到顶部部的事件
function getScrollData(e: any) {
  // 滚动到顶部
  if (e.srcElement.scrollTop === 0 && getMore.value)
    loadingMore()

  // if (e.srcElement.scrollTop + e.srcElement.offsetHeight >= e.srcElement.scrollHeight && getMore.value)
  //   getRoomMessageList(toRaw(paramsData.value))
}

const sendData = ref(null)
const sendReturnData = ref(null)
const isSend = ref(false)
const isNewTopic = ref(false)

async function sendClick() {
  if (sendData.value) {
    isSend.value = true
    const pushData: sendRequest = {
      roomId: roomData.value.roomId,
      content: sendData.value,
      isNewTopic: isNewTopic.value,
    }
    const data = await api.RoomNewBingSend(pushData, changData)
    // 此处的data只有错误的时候才会返回
    if (data && data.code !== 200) {
      ms.error(`请求失败!  ${data.message}`)
      // 重置数据
      sendData.value = null
      sendReturnData.value = null
      isSend.value = false
      // 滚动到底部
      messageScrollbar.value.scrollTo({ top: 999999999 })
    }
  }
}
async function getNewData() {
  // 循环请求到最后一个数据 同步多个房间请求时产生的数据
  while (true) {
    const oldList = toRaw(messageList.value)

    // 输出完了的回调
    const pushData = {
      cursor: oldList.length === 0 ? '' : String(oldList[oldList.length - 1].id),
      isUseCursor: oldList.length !== 0,
      roomId: roomData.value.roomId,
      size: 2,
      isAsc: true,
    }
    const { data } = await api.getRoomNewBingList(pushData)

    if (data.length < 2)
      break

    // 往栈存数据
    messageList.value = []
    messageList.value.push(...oldList, ...data)
    paramsData.value.isUseCursor = true
    paramsData.value.cursor = String(messageList.value[0].id)
  }
  // 滚动到底部
  messageScrollbar.value.scrollTo({ top: 999999999 })
}
// 流输入调用的函数
async function changData(talkdata: any, done = false) {
  if (done) {
    getNewData()

    // 重置数据
    sendData.value = null
    sendReturnData.value = null
    isSend.value = false
  }
  else {
    const lastIndex = talkdata.lastIndexOf('\n', talkdata.length - 2)

    try {
      if (lastIndex !== -1)
        sendReturnData.value = JSON.parse(talkdata.substring(lastIndex)).data.content
    }
    catch (error) {
      // json转换错误 (我只要不打印就没人知道,,,,,)
      // console.error('error', error)
    }
  }
}

// 开关的颜色
const railStyle = ({
  focused,
  checked,
}: {
  focused: boolean
  checked: boolean
}) => {
  const style: CSSProperties = {}
  if (checked) {
    style.background = roomData.value.color
    if (focused)
      style.boxShadow = '0 0 0 2px #d0305040'
  }
  else {
    style.background = '#dbdbdb'
    if (focused)
      style.boxShadow = '0 0 0 2px #2080f040'
  }
  return style
}
</script>

<template>
  <div h-screen class="text-[#fff] dark:text-[#3a3a3a]" flex flex-col>
    <roomHeader :color="roomData.color" :name="roomData.name" :cell-code="roomData.cellCode" :create-time="roomData.createTime" />
    <div flex-1 p-24 class=" text-[#3a3a3a] dark:text-[#fff]">
      <n-scrollbar ref="messageScrollbar" style="max-height: calc(100vh - 200px)" pr-14 :on-scroll="getScrollData">
        <div v-if="getMore" absolute top-0 right-0 left-0 f-c-c>
          <n-button tertiary round size="small" @click="loadingMore">
            加载更多...
          </n-button>
        </div>
        <div v-if="messageList.length === 0" flex justify-center>
          暂无数据
        </div>
        <div v-for="(item, index) of messageList" v-else :key="index">
          <!-- ai的回答 -->
          <div v-if="item.type === 'answer'" flex justify-start items-start mb-20>
            <div min-w-50>
              <n-avatar round>
                ai
              </n-avatar>
            </div>
            <div>
              <n-ellipsis min-width-140px>
                {{ item.createTime }}
              </n-ellipsis>
              <div flex justify-start>
                <div p-10 rd-10 inline-block break-all class="bg-[#f4f6f8]" dark:bg-hex-24272e>
                  {{ item.content }}
                </div>
              </div>
            </div>
          </div>
          <!-- 用户的提问 -->
          <div v-else flex justify-end items-start mb-20>
            <div>
              <div style="width: 100%;" flex justify-end>
                <n-ellipsis min-width-140px>
                  {{ item.createTime }}
                </n-ellipsis>
              </div>
              <div flex justify-end>
                <div p-10 rd-10 inline-block break-all style="background-color: #fed784;  color: #3a3a3a;">
                  {{ item.content }}
                </div>
              </div>
            </div>
            <div min-w-50 flex justify-end>
              <n-avatar round>
                user
              </n-avatar>
            </div>
          </div>
        </div>
        <!-- 用户的提问 -->
        <div v-if="isSend" flex justify-end items-start mb-20>
          <div p-10 rd-10 break-all style="background-color: #fed784; color: #3a3a3a; ">
            {{ sendData }}
          </div>
          <div min-w-50 flex justify-end>
            <n-avatar round>
              user
            </n-avatar>
          </div>
        </div>

        <div v-if="isSend" flex justify-start items-start mb-20>
          <div min-w-50>
            <n-avatar round>
              ai
            </n-avatar>
          </div>
          <div p-10 rd-10 break-all class="bg-[#f4f6f8]" dark:bg-hex-24272e>
            {{ sendReturnData }}
          </div>
        </div>
      </n-scrollbar>
    </div>
    <div>
      <!-- todo NAutoComplete / 提示 -->
      <!-- v-model:value="searchValue"  -->
      <!-- :on-input="searchClick" -->
      <div p-10 flex items-center>
        <div>
          <n-switch v-model:value="isNewTopic" size="large" w-100 :rail-style="railStyle">
            <template #checked>
              新话题
            </template>
            <template #unchecked>
              默认
            </template>
          </n-switch>
        </div>
        <n-input
          v-model:value="sendData"
          type="textarea"
          :disabled="isSend"
          maxlength="200" show-count size="large"
          :autosize="{ minRows: 1, maxRows: 8 }"
          placeholder="来说点啥吧....."
        />
        <n-button ml-10 size="large" type="primary" :color="`${roomData.color}`" :loading="isSend" @click="sendClick">
          <n-icon size="20">
            <icon-ri:send-plane-fill />
          </n-icon>
        </n-button>
      </div>
    </div>
  </div>
</template>