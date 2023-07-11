<script setup lang="ts">
import { ref } from 'vue'
import { useMessage } from 'naive-ui'
import { useDebounceFn } from '@vueuse/core'
import api from './api'
import type { CellConfigResponse, CellConfigVO, CellImageVO, CellImgResponse, CellResponse, CellVO, RoomListVO, RoomResponse, addRoomVo } from './types/types'
import { useCRUD } from '@/components/index.js'
import { useRoomStore } from '@/store'
import { setLocal } from '~/src/utils'

withDefaults(defineProps<Props>(), {
  cellType: 'allCell',
})
// import { router } from '~/src/router'

const router = useRouter()
const ms = useMessage()

const roomStore = useRoomStore()

interface Props {
  cellType?: string
}
// 获取当前cell下的聊天室列表数据,然后加载
// 列表的分页数据
const pNum = ref(1)
const pSize = ref(20)
const total = ref<number>(0)
const cellMenuList = ref<undefined | RoomListVO[]>([])
const isActiveCell = ref(1)
const searchValue = ref(undefined)

// 函数1 获取列表数据函数
async function getRoomList(name: undefined | string = undefined) {
  const pageNum: number = pNum.value
  const pageSize: number = pSize.value
  const res: RoomResponse = await api.getRoomPage({ pageNum, pageSize, name })

  if (res.data?.total)
    total.value = res.data?.total
  if (res.data?.records)
    cellMenuList.value?.push(...res.data?.records)
}
getCellList()
getRoomList()

// 获取更多数据
function getMoreData() {
  if (pNum.value * pSize.value < total.value) {
    pNum.value++
    getRoomList()
  }
}
// 搜索
function searchClick() {
  pNum.value = 1
  pSize.value = 20
  cellMenuList.value = []
  getRoomList(searchValue.value)
}

// 函数2 筛选数据函数

// 获取滚动到底部的事件
function getScrollData(e: any) {
  if (e.srcElement.scrollTop + e.srcElement.offsetHeight >= e.srcElement.scrollHeight)
    getMoreData()
}
// 选中对应的聊天室
const handleSelect = useDebounceFn(
  (item: RoomListVO) => {
    if (isActive(item.roomId))
      return

    if (isActiveCell.value)
      isActiveCell.value = item.roomId

    // setp1 将对应的聊天室数据存入到store
    roomStore.setRoomInfo(item)
    // setp2 在mainpage钟根据对应的聊天室渲染对应格式的组件页面

    router.push({
      name: item.cellCode,
      query: {
        roomId: item.roomId,
      },
    })
  }, 1000,
)

// 判断当前是否是选中的聊天室
function isActive(roomId: number) {
  return isActiveCell.value === roomId
}

const {
  modalVisible,
  modalAction,
  modalTitle,
  modalLoading,
  handleDelete,
  handleEdit,
  handleSave,
  modalForm,
  modalFormRef,
} = useCRUD({
  name: '房间',
  doDelete: api.deleteRoom,
  doUpdate: api.updateRoom,
  refresh: () => {
    pNum.value = 1
    pSize.value = 20
    cellMenuList.value = []
    searchValue.value = undefined
    getRoomList()
  },
})

// 新增
const current = ref<number>(1)
const showAddModal = ref(false)
const addloading = ref(false)
const AddModalFormRef = ref()
const AddModalForm = ref<addRoomVo>({
  roomInfo: {
    name: undefined,
    color: '#fead0b',
  },
  cellCode: undefined,
  roomConfigParams: undefined,
})
const AddRules = {
  roomInfo: {
    name: {
      required: true,
      message: '请输入房间名称',
      trigger: 'blur',
    },
    color: {
      required: true,
      message: '请选择颜色',
      trigger: ['blur', 'input'],
    },
  },
  cellCode: {
    required: true,
    message: '请选择图纸',
    trigger: 'blur',
  },
}

const cellList = ref<CellVO[]> ()
const cellImgList = ref<CellImageVO[]> ()
const cellConfigList = ref<CellConfigVO[]> ()

async function next() {
  if (current.value === 1) {
    if (AddModalForm.value.cellCode) {
      const { data }: CellConfigResponse = await api.getCellConfigList(AddModalForm.value.cellCode)
      cellConfigList.value = data
    }
    else {
      cellConfigList.value = []
      ms.warning('请先选择房间图纸')
      return
    }
  }

  if (current.value < 3)
    current.value++
  else
    ms.warning('到底啦')
}
function prev() {
  if (current.value > 1)
    current.value--
  else
    ms.warning('到顶了')
}

async function getCellList() {
  const res: CellResponse = await api.getCellList()
  const resImg: CellImgResponse = await api.getCellImgList()
  cellList.value = toRaw(res.data)
  cellImgList.value = toRaw(resImg.data)
  if (resImg.data) {
    roomStore.setCellImgList(resImg.data)
    setLocal('cellImgList', resImg.data)
  }
}

function getCellImg(type: string) {
  if (cellImgList.value) {
    for (const item of cellImgList.value) {
      if (type === item.code)
        return item.imageUrl
    }
  }
  return ''
}

function addItem() {
  AddModalFormRef.value?.validate(async (err: any) => {
    if (err) {
      ms.error('请填写完整数据')
      return
    }

    addloading.value = true
    if (!AddModalForm.value.roomConfigParams)
      AddModalForm.value.roomConfigParams = []

    api.addRoom(AddModalForm.value).finally(() => {
      addloading.value = false
      resetAddData()
      pNum.value = 1
      pSize.value = 20
      cellMenuList.value = []
      searchValue.value = undefined
      getRoomList()
      showAddModal.value = false
    })
  })
}

function resetAddData() {
  AddModalForm.value = {
    roomInfo: {
      name: undefined,
      color: '#fead0b',
    },
    cellCode: undefined,
    roomConfigParams: undefined,
  }
  current.value = 1
  cellConfigList.value = undefined
}

// 刷新相同路由
const isReload = ref(true)

function reload() {
  isReload.value = false
  nextTick(() => {
    isReload.value = true
  })
}
provide('reload', reload)
</script>

<template>
  <transition name="fade-slide" mode="out-in" appear>
    <section class="cus-scroll-y wh-full  flex-col bg-[#f5f5f5]" dark:bg-hex-121212>
      <n-layout flex-1 min-w-375 has-sider>
        <n-layout-sider
          bordered
          collapse-mode="width"
          content-style="padding: 15px;"
          width="350"
        >
          <n-layout-header bordered pb-15>
            <n-input-group>
              <n-input v-model:value="searchValue" round placeholder="搜索" :on-input="searchClick">
                <template #prefix>
                  <n-icon size="20">
                    <icon-material-symbols:search />
                  </n-icon>
                </template>
              </n-input>
              <n-button round type="primary" @click="showAddModal = true; getCellList()">
                <n-icon size="20">
                  <icon-ion:add-circle />
                </n-icon>
              </n-button>
            </n-input-group>
          </n-layout-header>
          <n-layout-content pt-15>
            <!-- 房间固定isPinned -->
            <n-scrollbar style="max-height: calc(100vh - 95px)" pr-14 :on-scroll="getScrollData">
              <div v-if="cellMenuList?.length === 0" mt-6 f-c-c>
                你敢不敢开个房试试
              </div>
              <div v-for="(item, index) of cellMenuList" v-else :key="index" flex>
                <n-card
                  size="small" hoverable mt-6
                  :class="isActive(item.roomId) && ['bg-neutral-100', 'text-[#FFAD0A]', 'dark:bg-[#24272e]']"
                  @click="handleSelect(item)"
                >
                  <!-- :style="{ borderBottom: `2px solid ${item.color}` }" -->
                  <div flex items-center>
                    <!-- 顶部icon -->
                    <div min-w-30 f-c-c>
                      <n-avatar
                        style="border: 2px solid #fff;"
                        round
                        size="small"
                        :src="getCellImg(item.cellCode ?? '')"
                        fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                      />
                    </div>
                    <div flex-1 ml-5 mr-5 style="overflow-x: hidden;">
                      <!-- 内容区域 -->
                      <n-ellipsis style="overflow-x: hidden; white-space: nowrap; text-overflow: ellipsis;" cursor-pointer>
                        {{ item.name }}
                      </n-ellipsis>
                      <!-- <n-ellipsis cursor-pointer style="overflow-x: hidden; white-space: nowrap; text-overflow: ellipsis; font-size: 8px; color: #929292; ">
                        {{ item.createTime }}
                      </n-ellipsis> -->
                    </div>
                    <div v-if="isActive(item.roomId)" flex min-w-35>
                      <n-button size="tiny" circle>
                        <n-icon size="16" @click="handleEdit(item)">
                          <icon-ri:edit-line />
                        </n-icon>
                      </n-button>
                      <n-button size="tiny" circle @click="handleDelete(item.roomId), router.replace('/main')">
                        <n-icon size="16">
                          <icon-ri:delete-bin-line />
                        </n-icon>
                      </n-button>
                    </div>
                  </div>
                </n-card>
              </div>
              <n-button v-if="pNum * pSize < total" round type="primary" mt-10 wh-full h-40 @click="getMoreData">
                <n-icon size="20">
                  <icon-material-symbols:local-shipping-rounded />
                </n-icon>
                <div ml-5>
                  加载更多
                </div>
              </n-button>
            </n-scrollbar>
          </n-layout-content>
        </n-layout-sider>
        <n-layout>
          <n-layout-content h-screen>
            <!-- <slot /> -->
            <!-- <n-watermark
              content="stargpt"
              cross
              selectable
              :font-size="16"
              :line-height="16"
              :width="192"
              :height="128"
              :x-offset="12"
              :y-offset="28"
              :rotate="-15"
            >
              <router-view v-if="isReload" />
            </n-watermark> -->

            <router-view v-if="isReload" />
          </n-layout-content>
        </n-layout>
      </n-layout>

      <!-- 编辑/查看 -->
      <CrudModal
        v-model:visible="modalVisible"
        :title="modalTitle"
        :loading="modalLoading"
        :show-footer="modalAction !== 'view'"
        width="960px"
        @on-save="handleSave"
      >
        <n-form
          ref="modalFormRef"
          label-placement="top"
          label-align="left"
          :model="modalForm"
          :disabled="modalAction === 'view'"
        >
          <n-form-item
            label="房间名称"
            path="name"
            :rule="{
              required: true,
              message: '请输入房间名称',
              trigger: ['input', 'blur'],
            }"
          >
            <n-input v-model:value="modalForm.name" placeholder="请输入房间名称" />
          </n-form-item>
          <!-- <n-form-item path="roomInfo.color" label="房间颜色">
            <div flex flex-wrap>
              <n-color-picker v-model:value="modalForm.color" mb-10 :show-alpha="false" :modes="['hsv']" />
              <n-radio-group v-model:value="modalForm.color">
                <n-space item-style="display: flex;">
                  <n-radio v-for="(item, index) of colorList" :key="index" type="primary" :value="item.value">
                    <div w-85 f-c-c b-rd-20 :style="{ backgroundColor: `${item.value}`, color: '#fff' }">
                      {{ item.label }}
                    </div>
                  </n-radio>
                </n-space>
              </n-radio-group>
            </div>
          </n-form-item> -->
        </n-form>
      </CrudModal>

      <!-- 新增 -->
      <n-modal
        v-model:show="showAddModal"
        style="width: 960px"
        title="新增房间"
        :bordered="false"
        size="huge"
        aria-modal="true"
        preset="card"
        :on-after-leave=" resetAddData()"
      >
        <div flex>
          <n-steps v-model:current="current">
            <n-step disabled title="图纸选择" />
            <n-step disabled title="属性配置" />
            <n-step disabled title="基本信息" />
          </n-steps>
          <n-button-group>
            <n-button @click="prev">
              上一步
            </n-button>
            <n-button @click="next">
              下一步
            </n-button>
          </n-button-group>
        </div>
        <!-- 1 图纸选择 -->
        <n-form ref="AddModalFormRef" :model="AddModalForm" :rules="AddRules" mt-30>
          <n-form-item v-show="current === 1" path="cellCode" label="图纸类型">
            <n-radio-group v-model:value="AddModalForm.cellCode" flex-wrap>
              <n-space item-style="display: flex;">
                <n-radio-button
                  v-for="(item, index) in cellList"
                  :key="index"
                  :value="item.code"
                  :disabled="!item.isCanUse || item.status !== 'published' "
                >
                  <div mt-10 f-c-c w-250>
                    <n-avatar
                      :size="40"
                      :src="item.imageUrl"
                      fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                    />
                    <div flex-1 ml-10>
                      <n-ellipsis style="max-width: 210px">
                        {{ item.name }}
                      </n-ellipsis>
                      <div>
                        {{ item.status === 'closed' ? '已关闭' : item.status === 'coding' ? '开发中' : item.status === 'fixing' ? '修改中' : '使用中' }}
                      </div>
                    </div>
                  </div>
                  <div mt-5 mb-10 p-10 w-250 break-all overflow-hidden class="bg-[#f2f2f2]" style="white-space:normal; ">
                    {{ item.introduce }}
                  </div>
                </n-radio-button>
              </n-space>
            </n-radio-group>
          </n-form-item>

          <n-form-item v-show="current === 2" path="roomConfigParams" label="房间配置参数">
            <ConfigList v-model:newCellConfigList="AddModalForm.roomConfigParams" :cell-config-list="cellConfigList ?? []" />
          </n-form-item>

          <n-form-item v-show="current === 3" path="roomInfo.name" label="房间名称">
            <n-input v-model:value="AddModalForm.roomInfo.name" placeholder="请输入房间名称" />
          </n-form-item>
          <!-- <n-form-item v-show="current === 3" path="roomInfo.color" label="房间颜色">
            <div flex flex-wrap>
              <n-color-picker v-model:value="AddModalForm.roomInfo.color" mb-10 :show-alpha="false" :modes="['hsv']" />
              <n-radio-group v-model:value="AddModalForm.roomInfo.color">
                <n-space item-style="display: flex;">
                  <n-radio v-for="(item, index) of colorList" :key="index" type="primary" :value="item.value">
                    <div w-85 f-c-c b-rd-20 :style="{ backgroundColor: `${item.value}`, color: '#fff' }">
                      {{ item.label }}
                    </div>
                  </n-radio>
                </n-space>
              </n-radio-group>
            </div>
          </n-form-item> -->
        </n-form>
        <template #footer>
          <footer flex justify-end>
            <slot name="footer">
              <NButton @click="showAddModal = false, resetAddData()">
                取消
              </NButton>
              <NButton :loading="addloading" ml-20 type="primary" @click="addItem()">
                提交
              </NButton>
            </slot>
          </footer>
        </template>
      </n-modal>
    </section>
  </transition>
</template>

<style lang="scss">

</style>
