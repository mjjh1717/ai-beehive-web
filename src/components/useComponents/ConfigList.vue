<!--
 * @Author: mjjh
 * @LastEditTime: 2023-07-14 00:40:27
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
watch(
  () => props.cellConfigList,
  (value, oldValue) => {
    if (value.length !== 0) {
      const newList: RoomConfigVO[] = []
      for (const item of toRaw(value)) {
        newList.push({
          value: item.isUserValueVisible && item.isHaveDefaultValue ? item.defaultValue : '',
          isUseDefaultValue: (item.isHaveDefaultValue && item.isUserModifiable) ?? false,
          cellConfigCode: item.cellConfigCode ?? '',
        })
      }
      cellConfigModalForm.value = newList
    }
  },
)

watch(cellConfigModalForm, (value, oldValue) => {
  const newValue = value.filter(item => item.value !== '')
  emit('update:newCellConfigList', newValue)
}, { deep: true })

// function resetData() {
//   cellConfigModalForm.value = []
// }
</script>

<template>
  <div v-if="props?.cellConfigList.length === 0">
    此图纸 无需配置
  </div>
  <div v-else>
    <n-form ref="AddModalFormRef" :model="cellConfigModalForm">
      <n-space v-if="cellConfigModalForm.length > 0" item-style="display: flex;">
        <n-form-item v-for="(item, index) of props?.cellConfigList" :key="index">
          <!-- <n-switch v-model:value="cellConfigModalForm[index].isUseDefaultValue" :disabled="item.defaultValue " mr-10 /> -->
          <template #label>
            <n-popover trigger="hover">
              <template #trigger>
                {{ item.name }}
              </template>
              <div>{{ item.introduce }}</div>
            </n-popover>
          </template>
          <div w-280 flex>
            <div v-if="cellConfigModalForm[index].isUseDefaultValue" flex-1 flex items-center p-5>
              {{ cellConfigModalForm[index].value !== '' ? cellConfigModalForm[index].value : '参数默认为空' }}
            </div>
            <n-input v-else v-model:value="cellConfigModalForm[index].value" :placeholder="item.exampleValue" />
            <n-button dashed :type=" cellConfigModalForm[index].isUseDefaultValue ? 'primary' : 'info' " w-70 :disabled="!item.isHaveDefaultValue || !item.isUserModifiable" ml-10 @click="cellConfigModalForm[index].isUseDefaultValue = !cellConfigModalForm[index].isUseDefaultValue">
              <div v-if="cellConfigModalForm[index].isUseDefaultValue">
                编辑
              </div>
              <div v-else @click="cellConfigModalForm[index].value = item.defaultValue">
                重置
              </div>
            </n-button>
          </div>
        </n-form-item>
      </n-space>
    </n-form>
  </div>
</template>
