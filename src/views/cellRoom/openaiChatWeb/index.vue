<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useMessage } from 'naive-ui'
import MdEditor from 'md-editor-v3'
import type { Themes } from 'md-editor-v3'
import api from './api'
import type { RoomOpenAiChatMsgVO, RoomOpenaiChatListRequest, sendRequest } from './types/apiTypes'
import roomHeader from '@/components/common/roomHeader.vue'
import { useRoomStore, useThemeStore } from '@/store'
import { useScroll } from '~/src/utils/common/useScroll'
const { scrollRef, scrollToBottom } = useScroll()

const route = useRoute()
const aiImgUrl = ref('')
const roomData = ref({
  cellCode: '',
  color: '',
  createTime: '',
  roomId: String(route.query.roomId),
  name: '',
})

const roomStore = useRoomStore()

const themStore = useThemeStore()

const themeStyle = ref<Themes>('light')
watch(
  () => themStore.darkMode,
  (newValue) => {
    if (newValue)
      themeStyle.value = 'dark'

    else

      themeStyle.value = 'light'
  },
  {
    immediate: true,
  },
)

const ms = useMessage()

// 使用父组件传递过来的值
const paramsData = ref<RoomOpenaiChatListRequest>({
  cursor: '',
  isUseCursor: false,
  roomId: roomData.value.roomId,
  size: 10,
  isAsc: false,
})
const getMore = ref(false)
const showGetMoreBtn = ref(true)
const messageList = ref <RoomOpenAiChatMsgVO[]>(roomStore.messageListData)
const firstGetListType = ref(roomStore.messageListData.length === 0)
const sendData = ref<string | null>(null)
const sendReturnData = ref(null)
const isSend = ref(false)

async function getDetail() {
  const { data } = await api.getRoomDetail(String(route.query.roomId))
  roomData.value.cellCode = data.cellCode
  roomData.value.color = data.color
  roomData.value.createTime = data.createTime
  roomData.value.name = data.name
  aiImgUrl.value = roomStore.getImgUrl(data.cellCode)
}
onMounted(() => {
  getDetail()
  loadingMore()
})
onUnmounted(() => {
  api.handleStop()
})

// 监听相同的路由变动
const reload = inject('reload')
watch(route, (value, oldValue) => {
  reload()
})

watch(messageList, (value, oldValue) => {
  if (value.length > 0) {
    // messageList不为空则存入本地数据中
    roomStore.setlocaMessageList(value)
  }
})

async function getRoomMessageList(params: RoomOpenaiChatListRequest) {
  const { data } = await api.getRoomOpenaiChatList(params)

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
  }
}

// 获取滚动到顶部部的事件
function getScrollData(e: any) {
  if (showGetMoreBtn.value)
    showGetMoreBtn.value = false

  // 滚动到顶部
  if (e.srcElement.scrollTop === 0 && getMore.value)
    loadingMore()
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
    const { data } = await api.getRoomOpenaiChatList(pushData)

    if (data.length < 2)
      break

    isSend.value = false
    // 往栈存数据
    messageList.value = []
    messageList.value.push(...oldList, ...data)
    paramsData.value.isUseCursor = true
    paramsData.value.cursor = String(messageList.value[0].id)
  }
  // 滚动到底部
  scrollToBottom()
}
function handleEnter(event: KeyboardEvent) {
  if (event.code === 'Enter') {
    if (event.ctrlKey) {
      sendData.value = `${sendData.value}\n`
    }
    else {
      event.preventDefault()
      sendClick()
    }
  }
}

async function sendClick() {
  if (sendData.value) {
    isSend.value = true
    const pushData: sendRequest = {
      roomId: roomData.value.roomId,
      content: sendData.value,
    }
    const data = await api.RoomOpenaiChatSend(pushData, changData)
    if (data && data.code !== 200) {
      ms.error(`请求失败!  ${data.message}`)
      // 重置数据
      sendData.value = null
      sendReturnData.value = null
      isSend.value = false
      // 滚动到底部
      scrollToBottom()
    }
  }
}
// 流输入调用的函数
async function changData(talkdata: any, done = false) {
  if (done) {
    await getNewData()

    // 重置数据
    sendData.value = null
    sendReturnData.value = null
    // isSend.value = false
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
</script>

<template>
  <div h-screen class="text-[#3a3a3a] dark:text-[#fff]" flex flex-col>
    <roomHeader :color="roomData.color" :name="roomData.name" :cell-code="roomData.cellCode" :room-id="roomData.roomId" :create-time="roomData.createTime" />
    <div id="scrollRef" ref="scrollRef" relative flex-1 overflow-hidden overflow-y-auto p-r-24 p-l-24 p-t-24 class=" text-[#3a3a3a] dark:text-[#fff]" @scroll="getScrollData">
      <div v-if="getMore && showGetMoreBtn" absolute top-10 right-0 left-0 f-c-c>
        <n-button tertiary round size="small" @click="loadingMore">
          加载更多...
        </n-button>
      </div>

      <div v-if="messageList.length === 0 && !isSend" mt-10 flex justify-center>
        你敢不敢说句话试试
      </div>
      <div v-for="(item, index) of messageList" v-else :key="index">
        <!-- ai的回答 -->
        <div v-if="item.messageType === 'answer'" flex justify-start items-start mb-20>
          <div min-w-50>
            <n-avatar
              round
              :src="aiImgUrl"
              fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
            />
          </div>
          <div>
            <n-ellipsis min-width-140px mb-5>
              {{ item.createTime }}
            </n-ellipsis>
            <div flex justify-start m-r-70>
              <MdEditor v-model="item.content" preview-only :theme="themeStyle" rd-10 inline-block break-all card-shadow />
            </div>
          </div>
        </div>
        <!-- 用户的提问 -->
        <div v-else flex justify-end items-start mb-20>
          <div>
            <div style="width: 100%;" flex justify-end>
              <n-ellipsis min-width-140px mb-5>
                {{ item.createTime }}
              </n-ellipsis>
            </div>
            <div flex justify-end>
              <div p-10 rd-10 inline-block break-all card-shadow whitespace-pre style="background-color: #fed784;   color: #3a3a3a; ">
                {{ item.content }}
              </div>
            </div>
          </div>
          <div min-w-50 flex justify-end>
            <n-avatar
              round
              src="https://img1.imgtp.com/2023/07/12/MBpt152Z.png"
              fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
            />
          </div>
        </div>
      </div>
      <!-- 用户的提问 -->
      <div v-if="isSend" flex justify-end items-start mb-20>
        <div p-10 rd-10 break-all card-shadow whitespace-pre style="background-color: #fed784;  color: #3a3a3a; ">
          {{ sendData }}
        </div>
        <div min-w-50 flex justify-end>
          <n-avatar
            round
            src="https://img1.imgtp.com/2023/07/12/MBpt152Z.png"
            fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
          />
        </div>
      </div>

      <div v-if="isSend" flex justify-start items-start mb-20>
        <div min-w-50>
          <n-avatar
            round
            :src="aiImgUrl"
            fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
          />
        </div>
        <div break-all>
          <!-- {{ sendReturnData }} -->
          <MdEditor v-if="sendReturnData" v-model="sendReturnData" preview-only :theme="themeStyle" rd-10 card-shadow />
        </div>
      </div>
      <!-- 与输入框的距离 -->
      <!-- <div h-500 /> -->
    </div>
    <div>
      <!-- todo NAutoComplete / 提示 -->
      <!-- v-model:value="searchValue"  -->
      <!-- :on-input="searchClick" -->
      <div p-10 flex items-center>
        <n-input
          v-model:value="sendData"
          type="textarea"
          :disabled="isSend"
          show-count size="large"
          :autosize="{ minRows: 1, maxRows: 8 }"
          placeholder="来说点啥吧..... ( Ctrl + Enter = 换行 ) "
          @keypress="handleEnter"
        />
        <!--  :color="`${roomData.color}`" -->
        <n-button ml-10 size="large" type="primary" :loading="isSend" @click="sendClick">
          <n-icon size="20">
            <icon-ri:send-plane-fill />
          </n-icon>
        </n-button>
      </div>
    </div>
  </div>
</template>
