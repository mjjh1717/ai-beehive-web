<script setup lang="ts">
import { onMounted, toRaw, toRefs } from 'vue'
import { useMessage } from 'naive-ui'
import type { UploadFileInfo } from 'naive-ui'
import api from './api'
import type { DescribeRequest, ImagineRequest, RoomMidjourneyMsgVO, RoomMidjourneyRequest, UpscaleRequest, VariationRequest } from './types/apiTypes'
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

const baseURL = import.meta.env.VITE_BASE_URL

const roomStore = useRoomStore()

const ms = useMessage()

// 使用父组件传递过来的值
const { roomData } = toRefs(props)
const paramsData = ref<RoomMidjourneyRequest>({
  cursor: '',
  isUseCursor: false,
  roomId: roomData.value.roomId,
  size: 10,
  isAsc: false,
})
const getMore = ref(false)
const messageScrollbar = ref()
const messageList = ref <RoomMidjourneyMsgVO[]>(roomStore.messageListData)
const firstGetListType = ref(roomStore.messageListData.length === 0)

// 图生文 的文件
const fileList = ref<UploadFileInfo[]>([])

watch(props, (value, oldValue) => {
  roomData.value = toRefs(value)
  getRoomMessageList(toRaw(paramsData.value))
})

watch(messageList, (value, oldValue) => {
  console.log('111roomStore')

  if (value.length > 0) {
    // messageList不为空则存入本地数据中
    roomStore.setlocaMessageList(value)
  }
})

async function getRoomMessageList(params: RoomMidjourneyRequest) {
  const { data } = await api.getRoomMidjourneyList(params)

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
}

const sendData = ref(null)
const isSend = ref(false)
const selectType = ref('imagine')

// 对话点击
async function sendClick() {
  if (selectType.value === 'imagine') {
    // 文生图
    imagineClick(sendData.value ?? '')
  }
  else {
    // 图生文
  }

  // if (sendData.value) {
  //   isSend.value = true
  //   const pushData: sendRequest = {
  //     roomId: roomData.value.roomId,
  //     content: sendData.value,
  //     isNewTopic: isNewTopic.value,
  //   }
  //   const data = await api.RoomNewBingSend(pushData)
  //   // 此处的data只有错误的时候才会返回
  //   if (data && data.code !== 200) {
  //     ms.error(`请求失败!  ${data.message}`)
  //     // 重置数据
  //     sendData.value = null
  //     sendReturnData.value = null
  //     isSend.value = false
  //     // 滚动到底部
  //     messageScrollbar.value.scrollTo({ top: 999999999 })
  //   }
  // }
}
// 获取新数据
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
    const { data } = await api.getRoomMidjourneyList(pushData)

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

// 继续生成图片
async function variationClick(msgId: number | undefined, index: number) {
  const pushData: VariationRequest = {
    index,
    msgId: msgId ?? -1,
    roomId: roomData.value.roomId,
  }
  const data = await api.RoomMidjourneyVariation(pushData)
  console.log('variationClick', data)
}
// 生成高质量图片
async function upscaleClick(msgId: number | undefined, index: number) {
  const pushData: UpscaleRequest = {
    index,
    msgId: msgId ?? -1,
    roomId: roomData.value.roomId,
  }
  const data = await api.RoomMidjourneyUpscale(pushData)
  console.log('upscaleClick', data)
}
// 文生图
async function imagineClick(prompt: string) {
  const pushData: ImagineRequest = {
    prompt,
    roomId: roomData.value.roomId,
  }
  const data = await api.RoomMidjourneyImagine(pushData)
  console.log('imagineClick', data)
}
// 图生文
// function describeClick() {

// }

// mj 更新数据
// setp1 遍历消息数组
// 查看每个消息的状态

// 一下三个状态需要开启定时任务, 请求数据
// SYS_QUEUING 系统排队中 60s
// MJ_WAIT_RECEIVED 等待 MJ 接收消息 30s
// MJ_IN_PROGRESS MJ 执行中 10s
const mjState = [
  {
    value: false,
    // MJ 失败
    text: 'MJ_FAILURE',
  },
  {
    value: 10,
    // MJ 执行中
    text: 'MJ_IN_PROGRESS',
  },
  {
    value: false,
    // MJ 成功
    text: 'MJ_SUCCESS',
  },
  {
    value: 30,
    // 等待 MJ 接受消息
    text: 'MJ_WAIT_RECEIVED',
  },
  {
    value: false,
    // 系统发送 MJ 请求失败
    text: 'SYS_FAILURE',
  },
  {
    value: false,
    // 系统完成 MJ 执行中任务失败
    text: 'SYS_FINISH_MJ_IN_PROGRESS_FAILURE',
  },
  {
    value: false,
    // 系统排队上限
    text: 'SYS_MAX_QUEUE',
  },
  {
    value: 60,
    // 系统排队中
    text: 'SYS_QUEUING',
  },
  {
    value: false,
    // 系统等待 MJ 接收消息失败
    text: 'SYS_SEND_MJ_REQUEST_FAILURE',
  },
  {
    value: false,
    // 系统成功
    text: 'SYS_SUCCESS',
  },
  {
    value: false,
    // 系统发送 MJ 请求失败
    text: 'SYS_WAIT_MJ_RECEIVED_FAILURE',
  },
]
// 判断状态
function isState(state: string) {
  for (const item of mjState) {
    if (item.text === state)
      return item.value
  }
}
// 开启定时任务 定时请求数据并且更新
function timingNewData(time: number) {
  setTimeout(() => { console.log('此处声明了一个定时器') }, time)
}

// 获取新数据
function getmsgNewData() {
  messageList.value.map((item) => {
    const isStateData = isState(String(item.status))
    if (isStateData) {
      // 获取最新数据
      console.log('1111', isStateData)
      timingNewData(isStateData)
    }
    return item
  })
}
getmsgNewData()

// setp2 根据状态 获取对应消息的最新数据

// setp3 根据 消息id 更新消息列表 并且更新本地存储(已经watch)
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
                  <div w-500>
                    <span fw-bold>
                      画图描述:
                    </span>
                    {{ item.prompt }}
                  </div>
                  {{ item }}
                  <n-image
                    mt-10
                    mb-10
                    :width="500"
                    :src="` ${baseURL}/${item.imageUrl}`"
                    fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                  />
                  <!-- 文生图 和 重新生成图片才有的按钮 -->
                  <div v-if="item.action === 'IMAGINE' || item.action === 'VARIATION'" w-300>
                    <div flex justify-between>
                      <n-button strong @click="upscaleClick(item.id, 1)">
                        u1
                      </n-button>
                      <n-button strong @click="upscaleClick(item.id, 2)">
                        u2
                      </n-button>
                      <n-button strong @click="upscaleClick(item.id, 3)">
                        u3
                      </n-button>
                      <n-button strong @click="upscaleClick(item.id, 4)">
                        u4
                      </n-button>
                    </div>
                    <div mt-5 flex justify-between>
                      <n-button strong @click="variationClick(item.id, 1)">
                        v1
                      </n-button>
                      <n-button strong @click="variationClick(item.id, 2)">
                        v2
                      </n-button>
                      <n-button strong @click="variationClick(item.id, 3)">
                        v3
                      </n-button>
                      <n-button strong @click="variationClick(item.id, 4)">
                        v4
                      </n-button>
                    </div>
                  </div>
                  <!-- 图生文才有的按钮 -->
                  <div v-else-if="item.action === 'DESCRIBE'" w-300>
                    <div flex justify-between>
                      <n-button strong>
                        1
                      </n-button>
                      <n-button strong>
                        2
                      </n-button>
                      <n-button strong>
                        3
                      </n-button>
                      <n-button strong>
                        4
                      </n-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 用户的提问 -->
          <div v-else flex justify-end items-strat mb-20>
            <div>
              <div style="width: 100%;" flex justify-end>
                <n-ellipsis min-width-140px>
                  {{ item.createTime }}
                </n-ellipsis>
              </div>
              <div flex justify-end>
                <div p-10 rd-10 inline-block break-all style="background-color: #fed784;  color: #3a3a3a;">
                  {{ item.prompt }}
                </div>
              </div>
            </div>
            <div min-w-50 flex justify-end>
              <n-avatar round>
                user
              </n-avatar>
            </div>
            <!-- 用户的提问 -->
            <!-- <div v-if="isSend" flex justify-end items-start mb-20>
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
        </div> -->
          </div>
        </div>
      </n-scrollbar>
    </div>
    <div>
      <div p-10 flex items-end>
        <div m-r-10px>
          <n-select
            v-model:value="selectType" size="large" :consistent-menu-width="false" :options="[
              {
                label: '图生文',
                value: 'describe',
              },
              {
                label: '文生图',
                value: 'imagine',
              },
            ]"
          />
        </div>
        <n-input
          v-if="selectType === 'imagine'"
          v-model:value="sendData"
          type="textarea"
          :disabled="isSend"
          maxlength="200"
          show-count size="large"
          :autosize="{ minRows: 1, maxRows: 8 }"
          placeholder="来说点啥吧....."
        />
        <div
          v-else
          style="width: 100%;"
        >
          <n-upload
            v-if="fileList.length === 0"
            ref="upload"
            v-model:file-list="fileList"
            directory-dnd
            :default-upload="false"
            :multiple="false"
            max="1"
            :show-file-list="false"
          >
            <n-upload-dragger flex justify-center items-center>
              <n-icon mr-10 size="28" color="#feac0a">
                <icon-material-symbols:upload-sharp />
              </n-icon>
              <n-text style="font-size: 16px">
                点击或者拖动文件到该区域来上传
              </n-text>
            </n-upload-dragger>
          </n-upload>
          <div v-else c-black>
            {{ toRaw(fileList[0].file) }}
          </div>
          <!-- <n-image
            v-else
            mt-10
            mb-10
            :width="500"
            :src="fileList[0].url"
            fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
          /> -->
        </div>
        <n-button ml-10 size="large" type="primary" :color="`${roomData.color}`" :loading="isSend" @click="sendClick">
          <n-icon size="20">
            <icon-ri:send-plane-fill />
          </n-icon>
        </n-button>
      </div>
    </div>
  </div>
</template>
