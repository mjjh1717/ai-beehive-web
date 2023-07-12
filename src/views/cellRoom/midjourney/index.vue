<script setup lang="ts">
import { onMounted, onUnmounted, toRaw } from 'vue'
import { useMessage } from 'naive-ui'
import MdEditor from 'md-editor-v3'
import type { UploadFileInfo } from 'naive-ui'
import api from './api'
import type { DescribeRequest, ImagineRequest, RoomMidjourneyMsgVO, RoomMidjourneyRequest, UpscaleRequest, VariationRequest } from './types/apiTypes'
import roomHeader from '@/components/common/roomHeader.vue'
import { useRoomStore } from '@/store'
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

const baseURL = import.meta.env.VITE_BASE_URL

const roomStore = useRoomStore()

const ms = useMessage()

const paramsData = ref<RoomMidjourneyRequest>({
  cursor: '',
  isUseCursor: false,
  roomId: roomData.value.roomId,
  size: 10,
  isAsc: false,
})
const getMore = ref(false)
const showGetMoreBtn = ref(true)
const messageList = ref <RoomMidjourneyMsgVO[]>(roomStore.messageListData)
const firstGetListType = ref(roomStore.messageListData.length === 0)

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
  getmsgNewData()
})
onUnmounted(() => {
  // 取消所有定时器
  clearAllInterval()
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

function loadingMore() {
  if (firstGetListType.value) {
    getRoomMessageList(toRaw(paramsData.value))
  }
  else {
    firstGetListType.value = true
    getNewData()
  }

  scrollToBottom()
}

// 获取滚动到顶部部的事件
function getScrollData(e: any) {
  if (showGetMoreBtn.value)
    showGetMoreBtn.value = false

  // 滚动到顶部
  if (e.srcElement.scrollTop === 0 && getMore.value)
    loadingMore()
}

const sendData = ref(null)
const isSend = ref(false)
const selectType = ref('imagine')
const showModal = ref(false)
const showModalUrl = ref('')

function handleEnter(event: KeyboardEvent) {
  if (event.code === 'Enter' && event.ctrlKey) {
    event.preventDefault()
    sendClick()
  }
}
// 对话点击
async function sendClick() {
  if (sendData.value) {
    isSend.value = true
    if (selectType.value === 'imagine') {
      // 文生图
      await imagineClick(sendData.value ?? '')
    }
    else {
    // 图生文
    }
    await getNewData()
    // 重置数据
    sendData.value = null
    isSend.value = false
    // 滚动到底部
    scrollToBottom()
  }
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
  scrollToBottom()
  getmsgNewData()
}

// 继续生成图片
async function variationClick(msgId: number | undefined, index: number) {
  const pushData: VariationRequest = {
    index,
    msgId: msgId ?? -1,
    roomId: roomData.value.roomId,
  }
  const { data } = await api.getRoomMidjourneyItem(String(msgId))
  for (const index in messageList.value) {
    if (messageList.value[index].id === msgId)
      messageList.value[index] = data
  }
  roomStore.setlocaMessageList(messageList.value)
  await api.RoomMidjourneyVariation(pushData)
  getNewData()
}

// 生成高质量图片
async function upscaleClick(msgId: number | undefined, index: number) {
  const pushData: UpscaleRequest = {
    index,
    msgId: msgId ?? -1,
    roomId: roomData.value.roomId,
  }
  const { data } = await api.getRoomMidjourneyItem(String(msgId))
  for (const index in messageList.value) {
    if (messageList.value[index].id === msgId)
      messageList.value[index] = data
  }
  roomStore.setlocaMessageList(messageList.value)
  await api.RoomMidjourneyUpscale(pushData)
  getNewData()
}
// 文生图
async function imagineClick(prompt: string) {
  const pushData: ImagineRequest = {
    prompt,
    roomId: roomData.value.roomId,
  }
  await api.RoomMidjourneyImagine(pushData)
  getNewData()
}
// 图生文
const isShowDescribeModal = ref(false)
const describeFileList = ref<UploadFileInfo[]>([])
// 限制文件类型
async function beforeUpload(data: {
  file: UploadFileInfo
  fileList: UploadFileInfo[]
}) {
  if (data.file.file?.size && data.file.file?.size < 10 * 1024 * 1024 && (data.file.file?.type === 'image/png' || data.file.file?.type === 'image/jpeg'))
    return true
  else
    ms.error('只能上传不超过 10MB 的 png/jpeg 格式的图片文件，请重新上传')

  return false
}

async function describeClick() {
  if (describeFileList.value.length) {
    const pushData = new FormData()
    pushData.append('file', describeFileList.value[0].file)
    pushData.append('roomId', roomData.value.roomId)
    await api.RoomMidjourneyDescribe(pushData)
    ms.success('图片上传成功')
    describeFileList.value = []
    getNewData()
  }
  else {
    ms.warning('请上传图片')
    return false
  }
}

function describeItemClick(id: number, str: string | undefined) {
  if (str)
    imagineClick(str.split('\n\n')[id - 1].slice(4))
}

// 定时间请求模块

// mj 更新数据
// setp1 遍历消息数组
// 进入房间的时候遍历一次加载一次状态 发送消息后遍历一次加载一次状态

// 需要维护一个定时器对象数组
// 1: 属性值为 messageid, 定时器对象
// 2: 有两个方法, 开启定时器(开启时默认请求一次) 删除定时器, 传入值为messageId
// 3: 在加载对应消息的状态为上面三个加载中的状态时 定时器开启,并且根据预设值请求数据
// 4: 在手动点击刷新进度时, 需要删除旧的定时器, 然后重新开启新的定时器,并且此时将按钮置为不可点击(5s后恢复)

// setp2 根据状态 获取对应消息的最新数据

// setp3 根据 消息id 更新消息列表 并且更新本地存储(已经watch)

// 查看每个消息的状态
// 以下三个状态需要开启定时任务, 请求数据
// SYS_QUEUING 系统排队中 60s
// MJ_WAIT_RECEIVED 等待 MJ 接收消息 30s
// MJ_IN_PROGRESS MJ 执行中 10s
const mjState = [
  {
    value: false,
    text: 'MJ_FAILURE',
    label: 'MJ 加载失败',
  },
  {
    value: 10000,
    text: 'MJ_IN_PROGRESS',
    label: 'MJ 加载执行中',
  },
  {
    value: false,
    text: 'MJ_SUCCESS',
    label: 'MJ 加载成功',
  },
  {
    value: 20000,
    text: 'MJ_WAIT_RECEIVED',
    label: '等待 MJ 接受消息',
  },
  {
    value: false,
    text: 'SYS_FAILURE',
    label: '系统发送 MJ 请求失败',
  },
  {
    value: false,
    text: 'SYS_FINISH_MJ_IN_PROGRESS_FAILURE',
    label: '系统完成 MJ 执行中任务失败',
  },
  {
    value: false,
    text: 'SYS_MAX_QUEUE',
    label: '系统排队上限',
  },
  {
    value: 30000,
    text: 'SYS_QUEUING',
    label: '系统排队中',
  },
  {
    value: false,
    text: 'SYS_SEND_MJ_REQUEST_FAILURE',
    label: '系统等待 MJ 接收消息失败',
  },
  {
    value: false,
    text: 'SYS_SUCCESS',
    label: '系统成功',
  },
  {
    value: false,
    text: 'SYS_WAIT_MJ_RECEIVED_FAILURE',
    label: '系统发送 MJ 请求失败',
  },
]
interface MESSAGE_INTERVAL_TYPE {
  [key: string]: any // 字段扩展声明
}
const messageIntervalDatas = ref<MESSAGE_INTERVAL_TYPE> ({})

const messageBtnTimeOut = ref<MESSAGE_INTERVAL_TYPE> ({})

// 判断状态
function isState(state: string) {
  for (const item of mjState) {
    if (item.text === state)
      return item
  }
}

// 遍历列表 如果状态为加载中则 获取新数据
function getmsgNewData() {
  messageList.value.map(async (item) => {
    const isStateData = isState(String(item.status))
    if (isStateData && isStateData.value && item.id)
      newMessageInterval(String(item.id), Number(isStateData.value))

    return item
  })
}

// 创建定时器
async function newMessageInterval(id: string, time = 10000) {
  // step 1 如果有定时器就先销毁
  if (messageIntervalDatas.value[id])
    clearMessageInterval(id)

  // step 2 第一次进来请求一次数据
  const { data } = await api.getRoomMidjourneyItem(id)
  for (const index in messageList.value) {
    if (String(messageList.value[index].id) === id)
      messageList.value[index] = data
  }
  roomStore.setlocaMessageList(messageList.value)
  // step 3 维护messageIntervalDatas.value对象
  messageIntervalDatas.value[id] = setInterval(async () => {
    const { data } = await api.getRoomMidjourneyItem(id)
    for (const index in messageList.value) {
      if (String(messageList.value[index].id) === id)
        messageList.value[index] = data
    }
    roomStore.setlocaMessageList(messageList.value)
    // step 4 如果状态更新则 清除定时器
    if (!['MJ_IN_PROGRESS', 'MJ_WAIT_RECEIVED', 'SYS_QUEUING'].includes(data.status)) {
      scrollToBottom()
      clearMessageInterval(id)
      clearBtnTimeOut(id)
    }
  }, time)
}

// 清除对应id的定时器
function clearMessageInterval(id: string) {
  clearInterval(messageIntervalDatas.value[id])
  delete messageIntervalDatas.value[id]
}

function clearBtnTimeOut(id: string) {
  clearTimeout(messageIntervalDatas.value[id])
  delete messageBtnTimeOut.value[id]
}

// 清除所有定时器
function clearAllInterval() {
  for (let i = 0; i < 10000; i++) {
    clearTimeout(i)
    clearInterval(i)
  }
}
// 获取哪个按钮可以刷新
function getrsBtnType(id: string, status: string) {
  if (['MJ_IN_PROGRESS', 'MJ_WAIT_RECEIVED', 'SYS_QUEUING'].includes(status)) {
    if (messageBtnTimeOut.value[id] === undefined)
      messageBtnTimeOut.value[id] = false

    return true
  }
  return false
}

// 刷新按钮点击
async function rsBtnClick(id: string, status: string) {
  clearBtnTimeOut(id)
  messageBtnTimeOut.value[id] = true

  const isStateData = isState(String(status))
  if (isStateData && isStateData.value && id) {
    await newMessageInterval(id, Number(isStateData.value))
    ms.success('进度更新成功!!!')
  }

  setTimeout(() => {
    clearBtnTimeOut(id)
    messageBtnTimeOut.value[id] = false
  }, 5000)
}

// 获取哪个按钮被点击了 不能再次点击
function selectBit(num: number, flag: number) {
  const strFlag = (num).toString(2)
  if (strFlag.charAt(flag - 1) === '1')
    return true

  return false
}

// 计算日期时间差距
function getTimeDate(newDate: string, oldDate: string) {
  const new_date = new Date(newDate).valueOf()
  const old_date = new Date(oldDate).valueOf()
  return (new_date - old_date) / 1000
}
</script>

<template>
  <div style="height: 100vh;" class="text-[#3a3a3a] dark:text-[#fff]" flex flex-col>
    <roomHeader :color="roomData.color" :name="roomData.name" :cell-code="roomData.cellCode" :create-time="roomData.createTime" />
    <div id="scrollRef" ref="scrollRef" relative flex-1 overflow-hidden overflow-y-auto p-r-24 p-l-24 p-t-24 class=" text-[#3a3a3a] dark:text-[#fff]" @scroll="getScrollData">
      <div v-if="getMore && showGetMoreBtn" absolute top-10 right-0 left-0 f-c-c>
        <n-button tertiary round size="small" @click="loadingMore">
          加载更多...
        </n-button>
      </div>
      <div v-if="messageList.length === 0" m-t-10 flex justify-center>
        你敢不敢说句话试试
      </div>
      <div v-for="(item, index) of messageList" v-else :key="index">
        <div v-if="item.type === 'answer'" flex justify-start items-start mb-20>
          <div min-w-50>
            <n-avatar
              round
              :src="aiImgUrl"
              fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
            />
          </div>
          <div>
            <n-ellipsis min-width-140px>
              {{ item.createTime }}
            </n-ellipsis>
            <div flex justify-start>
              <div p-20 rd-10 inline-block break-all class="bg-[#f4f6f8]" dark:bg-hex-24272e>
                <div max-w-600>
                  <span fw-bold min-w-70>
                    画图描述:
                  </span>
                  {{ `/${item.action}${item.uvIndex ? `: ${item.uvIndex}` : ''} ${item.prompt ?? ''}` }}
                </div>
                <div w-500 flex items-center>
                  <span fw-bold min-w-70>
                    任务状态:
                  </span>
                  {{ `${isState(String(item.status))?.label} ${item.waitQueueLength ?? ''}` }}
                  <n-button v-if="getrsBtnType(String(item.id), String(item.status))" type="success" ml-10 text :disabled="messageBtnTimeOut[String(item.id)]" size="tiny" strong w-60 @click="rsBtnClick(String(item.id), String(item.status))">
                    <n-icon size="20">
                      <icon-material-symbols:autorenew />
                    </n-icon>
                    更新进度
                  </n-button>
                </div>
                <div v-if="item.discordFinishTime" w-500>
                  <span fw-bold min-w-70>
                    任务耗时:
                  </span>
                  <span fw-bold>
                    {{ item.discordFinishTime ? ` ${getTimeDate(String(item.discordFinishTime), String(item.createTime))}秒` : '' }}
                  </span>
                  {{ item.createTime }}{{ item.discordFinishTime ? `-${item.discordFinishTime}` : '' }}
                </div>
                <div v-if="item.responseContent" flex>
                  <span fw-bold min-w-70>
                    响应内容：
                  </span>
                  <MdEditor v-model="item.responseContent" preview-only />
                </div>
                <div v-if="item.compressedImageUrl && item.originalImageUrl && !['MJ_IN_PROGRESS', 'MJ_WAIT_RECEIVED', 'SYS_QUEUING'].includes(String(item.status))" relative w-200 flex items-end>
                  <n-image
                    lazy
                    mt-10
                    b-rd-4
                    :show-toolbar="false"
                    :width="200"
                    :height="200"
                    :src="`${baseURL}${item.compressedImageUrl}`"
                    fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                  />
                  <n-button absolute bottom-0 right-0 type="primary" size="tiny" color="#767c82" @click="showModal = true; showModalUrl = `${baseURL}${item.originalImageUrl}`">
                    查看原图
                  </n-button>
                </div>
                <div v-if="item.status === 'MJ_SUCCESS' && (item.action === 'IMAGINE' || item.action === 'VARIATION')" mt-10 w-500 flex>
                  <div w-400>
                    <div flex justify-between>
                      <n-button w-80 size="large" :type="selectBit(item.uuseBit ?? 0, 1) ? 'primary' : ''" :disabled="selectBit(item.uuseBit ?? 0, 1)" strong @click="upscaleClick(item.id, 1)">
                        U1
                      </n-button>
                      <n-button w-80 size="large" :type="selectBit(item.uuseBit ?? 0, 2) ? 'primary' : ''" :disabled="selectBit(item.uuseBit ?? 0, 2)" strong @click="upscaleClick(item.id, 2)">
                        U2
                      </n-button>
                      <n-button w-80 size="large" :type="selectBit(item.uuseBit ?? 0, 3) ? 'primary' : ''" :disabled="selectBit(item.uuseBit ?? 0, 3)" strong @click="upscaleClick(item.id, 3)">
                        U3
                      </n-button>
                      <n-button w-80 size="large" :type="selectBit(item.uuseBit ?? 0, 4) ? 'primary' : ''" :disabled="selectBit(item.uuseBit ?? 0, 4)" strong @click="upscaleClick(item.id, 4)">
                        U4
                      </n-button>
                    </div>
                    <div mt-5 flex justify-between>
                      <n-button w-80 size="large" strong @click="variationClick(item.id, 1)">
                        V1
                      </n-button>
                      <n-button w-80 size="large" strong @click="variationClick(item.id, 2)">
                        V2
                      </n-button>
                      <n-button w-80 size="large" strong @click="variationClick(item.id, 3)">
                        V3
                      </n-button>
                      <n-button w-80 size="large" strong @click="variationClick(item.id, 4)">
                        V4
                      </n-button>
                    </div>
                  </div>
                </div>
                <div v-else-if="item.status === 'MJ_SUCCESS' && item.action === 'DESCRIBE'" mt-10 w-400>
                  <div flex justify-between>
                    <n-button w-80 size="large" @click="describeItemClick(1, item.responseContent)">
                      1
                    </n-button>
                    <n-button w-80 size="large" @click="describeItemClick(2, item.responseContent)">
                      2
                    </n-button>
                    <n-button w-80 size="large" @click="describeItemClick(3, item.responseContent)">
                      3
                    </n-button>
                    <n-button w-80 size="large" @click="describeItemClick(4, item.responseContent)">
                      4
                    </n-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else flex justify-end items-strat mb-20>
          <div>
            <div style="width: 100%;" flex justify-end>
              <n-ellipsis min-width-140px>
                {{ item.createTime }}
              </n-ellipsis>
            </div>
            <div flex justify-end>
              <div p-10 rd-10 inline-block break-all style="background-color: #fed784;  color: #3a3a3a;">
                {{ `/${item.action}${item.uvIndex ? `: ${item.uvIndex}` : ''} ${item.prompt ?? ''}` }}
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
      <!-- 与输入框的距离 -->
      <!-- <div h-500 /> -->
    </div>
    <div>
      <div p-10 flex items-center>
        <n-button mr-10 size="large" type="primary" @click="isShowDescribeModal = true">
          <n-icon size="20">
            <icon-material-symbols:image />
          </n-icon>
        </n-button>
        <n-input
          v-model:value="sendData"
          type="textarea"
          :disabled="isSend"
          show-count size="large"
          :autosize="{ minRows: 1, maxRows: 7 }"
          placeholder="来说点啥吧..... ( Ctrl + Enter = 发送 ) "
          @keypress="handleEnter"
        />
        <!-- :color="`${roomData.color}`" -->
        <n-button ml-10 size="large" type="primary" :loading="isSend" @click="sendClick">
          <n-icon size="20">
            <icon-ri:send-plane-fill />
          </n-icon>
        </n-button>
      </div>
    </div>

    <n-modal v-model:show="showModal" display-directive="if">
      <n-image
        lazy
        preview-disabled
        :width="900"
        :src="showModalUrl"
      />
    </n-modal>
    <n-modal
      v-model:show="isShowDescribeModal"
      preset="dialog"
      title="图生文"
      :style="{ width: 600 }"
      :show-icon="false"
      positive-text="确认"
      negative-text="取消"
      @positive-click="describeClick"
      @negative-click="isShowDescribeModal = false, describeFileList = []"
      @mask-click="isShowDescribeModal = false, describeFileList = []"
    >
      <n-upload
        v-model:file-list="describeFileList"
        directory-dnd
        @before-upload="beforeUpload"
      >
        <n-upload-dragger>
          <div style="margin-bottom: 12px">
            <n-icon size="48" :depth="3">
              <icon-material-symbols:image />
            </n-icon>
          </div>
          <n-text style="font-size: 16px">
            点击或者拖动图片到该区域来上传
          </n-text>
          <n-p depth="3" style="margin: 8px 0 0 0">
            仅支持 PNG 和 JPEG 格式图片
          </n-p>
        </n-upload-dragger>
      </n-upload>
    </n-modal>
  </div>
</template>
