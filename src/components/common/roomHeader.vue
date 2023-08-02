<script setup lang="ts">
import { useMessage } from 'naive-ui'
import type { CellConfigResponse, CellConfigVO, addRoomVo } from '~/src/views/page-main/types/types'
import api from '~/src/views/page-main/api'
const props = withDefaults(defineProps<Props>(), {})

const ms = useMessage()

interface Props {
  /** 图标名称(图片的文件名) */
  color: string
  name: string
  cellCode: string
  createTime: string
  roomId: string
}
const EditModalFormRef = ref()
const showModalLoading = ref(false)

const showEdit = ref(false)
const editloading = ref(false)

const editModalForm = ref<addRoomVo>({
  roomId: props.roomId,
  roomConfigParams: undefined,
})

const cellConfigList = ref<CellConfigVO[]> ()

async function initData() {
  showModalLoading.value = true
  const { data }: CellConfigResponse = await api.getRoomConfig(props.roomId)
  cellConfigList.value = data
  showModalLoading.value = false
}

function resetEditData() {
  editModalForm.value.roomConfigParams = undefined
  cellConfigList.value = undefined
}

function editItem() {
  EditModalFormRef.value?.validate(async (err: any) => {
    if (err) {
      ms.error('请填写完整数据')
      return
    }

    editloading.value = true
    if (!editModalForm.value.roomConfigParams)
      editModalForm.value.roomConfigParams = []

    api.editRoomConfig(editModalForm.value).finally(() => {
      editloading.value = false
      showEdit.value = false
      resetEditData()
    })
  })
}

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
    <n-button type="primary" @click="showEdit = true, initData()">
      <n-icon size="16">
        <icon-ri:edit-line />
      </n-icon>
      编辑
    </n-button>

    <n-modal
      v-model:show="showEdit"
      style="width: 960px"
      title="编辑房间配置"
      :bordered="false"
      size="huge"
      aria-modal="true"
      preset="card"
      :on-after-leave="resetEditData()"
    >
      <n-spin :show="showModalLoading">
        <n-form v-show="!showModalLoading" ref="EditModalFormRef" :model="editModalForm">
          <n-form-item>
            <ConfigList v-model:newCellConfigList="editModalForm.roomConfigParams" :cell-config-list="cellConfigList ?? []" />
          </n-form-item>
        </n-form>
      </n-spin>

      <template #footer>
        <footer flex justify-end>
          <slot name="footer">
            <NButton @click="showEdit = false, resetEditData()">
              取消
            </NButton>
            <NButton :loading="editloading" ml-20 type="primary" @click="editItem()">
              提交
            </NButton>
          </slot>
        </footer>
      </template>
    </n-modal>
  </div>
</template>
