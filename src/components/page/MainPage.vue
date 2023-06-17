<script setup lang="ts">
import { ref } from 'vue'
import type { SelectOption } from 'naive-ui'
import api from './api'
import type { CellConfigResponse, CellConfigVO, CellResponse, CellVO, RoomListVO, RoomResponse, addRoomVo } from './types/types'
import { ConfigList, useCRUD } from '@/components/index.js'
import { useRoomStore } from '@/store'
withDefaults(defineProps<Props>(), {
  cellType: 'allCell',
})

const roomStore = useRoomStore()

interface Props {
  cellType?: string
}
// 获取当前cell下的聊天室列表数据,然后加载
// 列表的分页数据
const pNum = ref(1)
const pSize = ref(10)
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
  pSize.value = 10
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
function handleSelect(item: RoomListVO) {
  if (isActive(item.roomId))
    return

  if (isActiveCell.value)
    isActiveCell.value = item.roomId

  // setp1 将对应的聊天室数据存入到store
  roomStore.setRoomInfo(item)

  // setp2 在mainpage钟根据对应的聊天室渲染对应格式的组件页面
}

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
    pSize.value = 10
    cellMenuList.value = []
    searchValue.value = undefined
    getRoomList()
  },
})

const showAddModal = ref(false)
const addloading = ref(false)
const selectloading = ref(false)
const AddModalFormRef = ref()
const AddModalForm = ref<addRoomVo>({
  roomInfo: {
    name: undefined,
    color: 'rgb(254, 172, 10)',
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
      // todo需要限制可选色域范围
      // validator(rule: any, value: string) {
      // // 自定义验证  规则
      //   const regMobile = /^[rR][gG][Bb][Aa]?[\(]([\s]*(1[0-4][0-9]|19[0-5]|[01]?[0-9][0-9]?),){2}[\s]*(1[0-4][0-9]|19[0-5]|[01]?[0-9][0-9]?),?[\s]*(0\.\d{1,2}|1|0)?[\)]{1}$/g
      //   if (!value)
      //     return new Error('请选择颜色')

      //   else if (!regMobile.test(value))
      //     return new Error('请选择在范围内的颜色')

      //   return true
      // },
    },
  },
  cellCode: {
    required: true,
    message: '请选择图纸类型',
    trigger: 'blur',
  },
}

const cellList = ref<CellVO[]> ()
const cellConfigList = ref<CellConfigVO[]> ()
async function getCellList() {
  selectloading.value = true
  const res: CellResponse = await api.getCellList()
  cellList.value = res.data
  if (cellList.value)
    cellList.value.map(item => item.disabled = !item.isCanUse)
  selectloading.value = false
}

async function handleUpdateValue(value: string, option: SelectOption) {
  if (value) {
    const res: CellConfigResponse = await api.getCellConfigList(value)
    cellConfigList.value = res.data
  }
  else {
    cellConfigList.value = []
  }
}

function addItem() {
  AddModalFormRef.value?.validate(async (err: any) => {
    if (err)
      return

    addloading.value = true

    api.addRoom(AddModalForm.value).finally(() => {
      addloading.value = false
      resetAddData()
      pNum.value = 1
      pSize.value = 10
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
      color: 'rgb(254, 172, 10)',
    },
    cellCode: undefined,
    roomConfigParams: undefined,
  }
  cellList.value = undefined
  cellConfigList.value = undefined
}
</script>

<template>
  <transition name="fade-slide" mode="out-in" appear>
    <section class="cus-scroll-y wh-full  flex-col bg-[#f5f5f5]" dark:bg-hex-121212>
      <n-layout flex-1 min-w-375 has-sider>
        <n-layout-sider
          bordered
          content-style="padding: 15px;"
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
              <n-button round type="primary" @click="showAddModal = true, getCellList()">
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
                暂无数据
              </div>
              <div v-for="(item, index) of cellMenuList" v-else :key="index" flex>
                <n-card
                  size="small" hoverable mt-6
                  :class="isActive(item.roomId) && ['bg-neutral-100', 'text-[#FFAD0A]', 'dark:bg-[#24272e]']"
                  :style="{ borderBottom: `2px solid ${item.color}` }"
                  @click="handleSelect(item)"
                >
                  <div flex>
                    <!-- 顶部icon -->
                    <n-icon size="20">
                      <icon-ri:message-3-line />
                    </n-icon>
                    <!-- 内容区域 -->
                    <n-ellipsis ml-5 mr-5 flex-1 cursor-pointer>
                      {{ item.name }}
                    </n-ellipsis>
                    <div v-if="isActive(item.roomId)" flex w-35>
                      <n-button size="tiny" circle>
                        <n-icon size="16" @click="handleEdit(item)">
                          <icon-ri:edit-line />
                        </n-icon>
                      </n-button>
                      <n-popconfirm placement="bottom" @positive-click="handleDelete(item.roomId)">
                        <template #trigger>
                          <n-button size="tiny" circle>
                            <n-icon size="16">
                              <icon-ri:delete-bin-line />
                            </n-icon>
                          </n-button>
                        </template>
                        确定删除此聊天室吗?
                      </n-popconfirm>
                    </div>
                  </div>
                </n-card>
              </div>
              <n-button round type="primary" mt-10 wh-full h-40 @click="getMoreData">
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
            <slot />
          </n-layout-content>
        </n-layout>
      </n-layout>

      <!-- 编辑/查看 -->
      <CrudModal
        v-model:visible="modalVisible"
        :title="modalTitle"
        :loading="modalLoading"
        :show-footer="modalAction !== 'view'"
        width="400px"
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
          <!-- <n-form-item
            label="房间颜色"
            path="color"
          >
            <n-color-picker v-model:value="modalForm.color" :show-alpha="false" :modes="['rgb']" />
          </n-form-item> -->
        </n-form>
      </CrudModal>

      <!-- 新增 -->
      <n-modal
        v-model:show="showAddModal"
        style="width: 400px"
        title="新增房间"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        preset="card"
      >
        <n-form ref="AddModalFormRef" :model="AddModalForm" :rules="AddRules">
          <n-form-item path="roomInfo.name" label="房间名称">
            <n-input v-model:value="AddModalForm.roomInfo.name" placeholder="请输入房间名称" />
          </n-form-item>
          <!-- <n-form-item path="roomInfo.color" label="房间颜色">
            <n-color-picker v-model:value="AddModalForm.roomInfo.color" :show-alpha="false" :modes="['rgb']" />
          </n-form-item> -->
          <n-form-item path="cellCode" label="图纸类型">
            <n-select
              v-model:value="AddModalForm.cellCode"
              filterable
              placeholder="请选择图纸类型"
              label-field="name"
              value-field="code"
              :options="cellList"
              :loading="selectloading"
              clearable
              remote
              @update:value="handleUpdateValue"
            />
          </n-form-item>
          <n-form-item path="roomConfigParams" label="房间配置参数">
            <ConfigList v-model:newCellConfigList="AddModalForm.roomConfigParams" :cell-config-list="cellConfigList ?? []" />
          </n-form-item>
        </n-form>
        <template #footer>
          <footer flex justify-end>
            <slot name="footer">
              <NButton @click="showAddModal = false, resetAddData()">
                取消
              </NButton>
              <NButton :loading="addloading" ml-20 type="primary" @click="addItem()">
                保存
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
