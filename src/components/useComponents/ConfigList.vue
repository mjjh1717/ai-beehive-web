<!--
 * @Author: mjjh
 * @LastEditTime: 2023-06-06 21:46:54
 * @FilePath: \ai-beehive-web\src\components\useComponents\ConfigList.vue
 * @Description:
-->
<script setup lang="ts">
import { watch } from 'vue'

interface CellConfigVO {
  /**
   * 配置项编码
   */
  cellConfigCode?: string
  /**
   * 默认值
   */
  defaultValue?: string
  /**
   * 示例值
   */
  exampleValue?: string
  /**
   * 介绍
   */
  introduce?: string
  /**
   * 是否有默认值，false 否 true 是
   */
  isHaveDefaultValue?: boolean
  /**
   * 是否必填，false 否 true 是
   */
  isRequired?: boolean
  /**
   * 用户是否可以使用默认值，false 否 true 是
   */
  isUserCanUseDefaultValue?: boolean
  /**
   * 用户创建房间后是否可修改，false 否 true 是
   */
  isUserLiveModifiable?: boolean
  /**
   * 用户是否可修改，false 否 true 是
   */
  isUserModifiable?: boolean
  /**
   * 用户是否可见默认值，false 否 true 是
   */
  isUserValueVisible?: boolean
  /**
   * 名称
   */
  name?: string
}

interface RoomConfigVO {
  /**
   * 配置项 code
   */
  cellConfigCode: string
  /**
   * 是否使用默认值
   */
  isUseDefaultValue: boolean
  /**
   * 配置项值
   */
  value?: string
}

const props = defineProps({
  cellConfigList: {
    type: Array<CellConfigVO>,
    default() {
      return []
    },
    required: true,
  },
})
const emit = defineEmits(['update:newCellConfigList'])
const cellConfigModalForm = ref<RoomConfigVO[]>([])

watch(props, (value, oldValue) => {
  if (value.cellConfigList.length === 0) {
    resetData()
  }
  else {
    for (const item of value.cellConfigList) {
      cellConfigModalForm.value.push({
        value: item.isUserValueVisible && item.isHaveDefaultValue && item.isUserCanUseDefaultValue ? item.defaultValue : '',
        isUseDefaultValue: (item.isHaveDefaultValue && item.isUserModifiable) ?? false,
        cellConfigCode: item.cellConfigCode ?? '',
      })
    }
  }
})

watch(cellConfigModalForm, (value, oldValue) => {
  const newValue = value.filter(item => item.value === '')
  emit('update:newCellConfigList', newValue)
}, { deep: true })

function resetData() {
  cellConfigModalForm.value = []
}
</script>

<template>
  <div v-if="props?.cellConfigList.length === 0" c-error>
    请先选择图纸类型
  </div>
  <div v-else>
    <n-form ref="AddModalFormRef" :model="cellConfigModalForm">
      <n-form-item v-for="(item, index) of props?.cellConfigList" :key="index" :label="item.introduce">
        <!-- <n-switch v-model:value="cellConfigModalForm[index].isUseDefaultValue" :disabled="item.defaultValue && item.isUserCanUseDefaultValue" mr-10 /> -->
        <n-input v-if="cellConfigModalForm[index].isUseDefaultValue" v-model:value="cellConfigModalForm[index].value" :placeholder="item.exampleValue" />
        <div v-else>
          {{ cellConfigModalForm[index].value }}
        </div>
        <n-button :disabled="!item.isHaveDefaultValue || !item.isUserModifiable" ml-10 @click="cellConfigModalForm[index].isUseDefaultValue = !cellConfigModalForm[index].isUseDefaultValue">
          <div v-if="cellConfigModalForm[index].isUseDefaultValue">
            自定义
          </div>
          <div v-else>
            默认
          </div>
        </n-button>
      </n-form-item>
    </n-form>
  </div>
</template>
