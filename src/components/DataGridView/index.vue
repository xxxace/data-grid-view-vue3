<template>
  <div ref="eVirtTableRef" @contextmenu.prevent>
    <div ref="eVirtTableEditorRef"></div>
    <div ref="eVirtTableEmptyRef">
      <!-- 自定义空数据 -->
      <!-- <el-empty description="空数据" /> -->
    </div>
    <div ref="eVirtTableOverlayerRef">
      <!-- 自定覆盖层 -->
      <div :class="wrapper.class" v-for="wrapper in overlayerView.views" :style="wrapper.style" :key="wrapper.type">
        <div :style="view.style" v-for="view in wrapper.views" :key="view.key">
          <div class="cell" v-for="cell in view.cells" :key="`${cell.rowKey}_${cell.key}`" :style="cell.style">
            <component v-if="typeof cell.render === 'function'" :is="cell.render(cell)"></component>
            <template v-else-if="typeof cell.render === 'string'">
              <slot :name="cell.render" v-bind="cell" :cell="cell"></slot>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// 导入依赖
import type { Column, ConfigType, OverlayerContainer, RowParams } from 'e-virt-table'
import EVirtTable from 'e-virt-table'
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import { NumberInputEditor, SelectEditor, CustomInputEditor } from './Editor'
import Theme from './config/theme'

export type TableInstance = EVirtTable | null

export interface DataGridViewProps {
  columns: Column[]
  data: any[]
  footerData?: any[]
  config?: ConfigType
  loading?: boolean
}

export interface DataGridViewEmits {
  (e: 'change', value: any[]): void
  (e: 'ready', value: EVirtTable): void
  (e: 'current-row-change', row: any, rowParams: RowParams | undefined): void
}

export type TableState = {
  currentRow: RowParams | Record<string, any>
  dataSource: any[]
}

// 事件和属性定义
const emit = defineEmits<DataGridViewEmits>()
const props = withDefaults(defineProps<DataGridViewProps>(), {
  columns: () => [],
  data: () => [],
  footerData: () => [],
  config: () => ({}),
  loading: false
})

// 引用和状态定义
const state = reactive<TableState>({
  currentRow: {},
  dataSource: []
})
const eVirtTableRef = ref<HTMLDivElement>()
const eVirtTableEditorRef = ref<HTMLDivElement>()
const eVirtTableEmptyRef = ref<HTMLDivElement>()
const eVirtTableOverlayerRef = ref<HTMLDivElement>()
const overlayerView = ref<OverlayerContainer>({ views: [] })

// 表格实例
let eVirtTable: TableInstance = null

/**
 * 处理数据，添加唯一标识并深拷贝避免修改原数据
 */
const processData = (data: any[]): any[] => {
  if (!Array.isArray(data)) return []

  return data.map((item, index) => {
    // 深拷贝避免修改原数据
    const clonedItem = JSON.parse(JSON.stringify(item))
    // 确保每行数据有唯一标识
    if (!clonedItem.rowKey && !clonedItem.id) {
      clonedItem.rowKey = `row_${Date.now()}_${index}`
    }
    return clonedItem
  })
}

/**
 * 绑定表格事件
 */
const bindEvents = (): void => {
  if (!eVirtTable) return

  // 绑定基础事件
  eVirtTable.on('change', (value: any[]) => emit('change', value))
  eVirtTable.on('overlayerChange', (overlayer: OverlayerContainer) => {
    overlayerView.value = overlayer
  })
  eVirtTable.on('startEdit', (cell: any) => {
    // 根据编辑器类型创建对应的编辑器实例
    switch (cell.editorType) {
      case 'number':
        new NumberInputEditor(eVirtTable!)
        break
      case 'select':
        new SelectEditor(eVirtTable!)
        break
      case 'customInput':
        new CustomInputEditor(eVirtTable!)
        break
    }
  })
  eVirtTable.on('currentRowChange', (row: RowParams) => {
    updateCurrentRow()
  })
}

/**
 * 获取表格实例的方法
 */
const getTableInstance = (): TableInstance => eVirtTable

/**
 * 通过rowKey设置高亮当前行
 */
const setCurrentRow = (rowKey?: string): void => {
  console.log('setCurrentRow', rowKey)
  if (rowKey) {
    eVirtTable?.setCurrentRow(rowKey)
  } else {
    const rowParams = eVirtTable?.getCurrentRow()
    if (rowParams) {
      eVirtTable?.setCurrentRow(rowParams.rowKey)
    } else {
      eVirtTable?.setCurrentRowByRowIndex(0)
    }
  }

  updateCurrentRow()
}

/**
 * 通过rowIndex设置高亮当前行
 */
const setCurrentRowByRowIndex = (rowIndex: number): void => {
  eVirtTable?.setCurrentRowByRowIndex(rowIndex)
  updateCurrentRow()
}

/**
 * 获取高亮当前行数据
 */
const getCurrentRow = (): any | null => {
  const row = eVirtTable?.getCurrentRow()
  return row
}

const updateCurrentRow = () => {
  const rowParams = eVirtTable?.getCurrentRow()
  state.currentRow = rowParams || {}
  const currentRow = state.currentRow.row
  emit('current-row-change', Object.assign({}, currentRow || {}), rowParams)
}

/**
 * 清理资源
 */
const cleanupResources = (): void => {
  // 销毁表格实例
  if (eVirtTable) {
    try {
      eVirtTable.destroy()
    } catch (error) {
      console.error('Error destroying table instance:', error)
    }
    eVirtTable = null
  }
}

const configAdapter = () => {
  const config = Object.assign({}, props.config)
  if (config.HEIGHT === 'auto') {
    config.HEIGHT = config.MAX_HEIGHT = getTableHeight()
  }
}

const processColumns = (columns: Column[]): Column[] => {
  return columns.map((column) => {
    if (column.width !== undefined && column.width !== null) {
      column.widthFillDisable = true
    }
    return column
  })
}

// 监听数据和配置变化
watch(() => props.columns, (newValue = []) => {
  eVirtTable?.loadColumns(processColumns(newValue))
}, { deep: true })

watch(() => props.data, (newValue = []) => {
  if (!eVirtTable) return

  // 处理数据，添加唯一标识
  const processedData = processData(newValue)
  state.dataSource = processedData
  eVirtTable.loadData(processedData)

  setCurrentRow()
}, { deep: true })

watch(() => props.loading, (newValue: boolean) => {
  eVirtTable?.setLoading(newValue)
})

watch(() => props.footerData, (newValue = []) => {
  eVirtTable?.loadFooterData(newValue)
}, { deep: true })

// 组件生命周期
onMounted(() => {
  if (!eVirtTableRef.value) return

  try {
    state.dataSource = processData(props.data)
    // 创建表格实例
    eVirtTable = new EVirtTable(eVirtTableRef.value, {
      config: { ...Theme.editTable, ...props.config },
      columns: processColumns(props.columns),
      data: state.dataSource,
      footerData: props.footerData,
      emptyElement: eVirtTableEmptyRef.value,
      overlayerElement: eVirtTableOverlayerRef.value,
      editorElement: eVirtTableEditorRef.value,
    })

    // 绑定事件
    bindEvents()

    // 设置loading状态
    if (props.loading) {
      eVirtTable.setLoading(true)
    }
    setCurrentRow()
    // 通知组件已准备就绪
    emit('ready', eVirtTable)
  } catch (error) {
    console.error('Failed to initialize DataGridView:', error)
    // 出错时确保资源被清理
    cleanupResources()
  }
})

onUnmounted(() => {
  cleanupResources()
})

// 暴露方法供外部组件调用
defineExpose({
  getTableInstance,
  setCurrentRow,
  setCurrentRowByRowIndex,
  getCurrentRow,
  eVirtTableEmptyRef,
  eVirtTableOverlayerRef,
  overlayerView
})
</script>

<style lang="scss">
.e-virt-table-container {
  height: 100%;
}

// 基础表格样式
.e-virt-table-stage {
  --evt-border-color: #ced1d8;
  border-radius: 0 !important;
  height: 100%;
}

// 编辑器通用样式
.e-virt-table-editor-input,
.e-virt-table-editor-select,
.e-virt-table-editor-cascader,
.e-virt-table-editor-date,
.e-virt-table-editor-time,
.e-virt-table-editor-number {
  width: 100% !important;
  height: 100% !important;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  outline: none;
}

// 输入框编辑器样式
.e-virt-table-editor-input {
  border: none !important;
  padding: 0 4px;
  box-sizing: border-box;
}

// 带有el-input的编辑器样式
.e-virt-table-editor-cascader,
.e-virt-table-editor-date,
.e-virt-table-editor-time {
  border: none;
  background: transparent;

  .el-input__wrapper {
    box-shadow: none !important;
    border: none !important;
    background: transparent !important;
  }
}

// 下拉选择编辑器样式
.e-virt-table-editor-select {
  border: none;
  background: transparent;

  .el-select__wrapper {
    box-shadow: none !important;
    border: none !important;
    background: transparent !important;
  }
}

// 数字编辑器特殊样式
.e-virt-table-editor-number {
  .el-input__inner {
    text-align: right !important;
    // 隐藏数字输入框的箭头
    -moz-appearance: textfield;
  }

  // 隐藏数字输入框的箭头（Webkit浏览器）
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}

// 自定义编辑器容器样式
.e-virt-table-editor-custom {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
