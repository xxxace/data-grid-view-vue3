<template>
  <div class="tabulator-table-vue">
    <div ref="tableContainerRef"></div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import './style.css'
// import 'tabulator-tables/dist/css/tabulator.min.css'
import {
  Tabulator,
  ClipboardModule,
  ColumnCalcsModule,
  EditModule,
  ExportModule,
  FormatModule,
  FrozenColumnsModule,
  InteractionModule,
  KeybindingsModule,
  MenuModule,
  ResizeColumnsModule,
  // ResponsiveLayoutModule,
  SelectRangeModule,
  SelectRowModule,
  TooltipModule
} from 'tabulator-tables'
import type { DataGridViewProps, DataGridViewColumn, DataGridViewOptions } from './types'
import { addRangeHack } from './hack'

Tabulator.registerModule(ClipboardModule)
Tabulator.registerModule(ColumnCalcsModule)
Tabulator.registerModule(EditModule)
Tabulator.registerModule(ExportModule)
Tabulator.registerModule(FormatModule)
Tabulator.registerModule(FrozenColumnsModule)
Tabulator.registerModule(InteractionModule)
Tabulator.registerModule(KeybindingsModule)
Tabulator.registerModule(MenuModule)
Tabulator.registerModule(ResizeColumnsModule)
// Tabulator.registerModule(ResponsiveLayoutModule)
Tabulator.registerModule(SelectRangeModule)
Tabulator.registerModule(SelectRowModule)
Tabulator.registerModule(TooltipModule)

const props = withDefaults(defineProps<DataGridViewProps>(), {
  columns: () => [] as DataGridViewColumn[],
  data: () => [] as any,
})

const tableContainerRef = ref<HTMLElement>()
const tableRef = ref<Tabulator>()

const render = () => {
  if (!tableContainerRef.value) return
  const options: DataGridViewOptions = {
    rowHeight: 28,
    // rowFormatter: (row) => {
    //   console.log(row,row)
    //   if (row.getPosition() === 1) {
    //     row.getElement().style.backgroundColor = '#1e3b20'
    //   }
    // },
    height: '100%',

    rowHeader: { formatter: "rownum", headerSort: false, hozAlign: "center", resizable: false, frozen: true },

    renderVertical: 'virtual',
    renderHorizontal: "virtual",

    columnDefaults: {
      resizable: 'header',
    },
    data: props.data,
    columns: props.columns,
    columnHeaderVertAlign: 'bottom',

    // selectableRows: 1,
    //enable range selection
    selectableRange: 1,
    selectableRangeColumns: true,
    selectableRangeRows: true,
    selectableRangeClearCells: true,

    clipboard: 'copy',
    clipboardCopyRowRange: 'range',
    // clipboardPasteAction: 'range',
  }
  tableRef.value = new Tabulator(tableContainerRef.value, options)



  // addRangeHack(tableRef.value)
}

watch(
  () => props.columns,
  (newColumns) => {
    tableRef.value?.setColumns(newColumns)
  },
)

watch(
  () => props.data,
  (newData) => {
    tableRef.value?.setData(newData)
  },
)

onMounted(() => {
  render()
})
</script>
<style lang="scss" scoped>
.tabulator-table-vue {
  height: 100%;
  width: 100%;
  position: relative;
  box-sizing: border-box;

  ::v-deep(.tabulator) {
    .tabulator-tableholder {
      --sb-track-color: #e9e9e9;
      --sb-thumb-color: #adadad;
      --sb-size: 14px;

      // // 设置水平和垂直滚动条的尺寸
      // &::-webkit-scrollbar {
      //   width: var(--sb-size);
      //   height: var(--sb-size);
      // }

      // // 滚动条轨道样式
      // &::-webkit-scrollbar-track {
      //   background: var(--sb-track-color);
      //   border-radius: 1px;
      //   -webkit-box-shadow: inset 0 0 5px rgba(150, 150, 150, 0.2);
      // }

      // // 滚动条滑块样式
      // &::-webkit-scrollbar-thumb {
      //   background: var(--sb-thumb-color);
      //   border-radius: 1px;
      // }

      // @supports not selector(::-webkit-scrollbar) {
      //   & {
      //     scrollbar-color: var(--sb-thumb-color) var(--sb-track-color);
      //   }
      // }

      .tabulator-range-overlay {
        z-index: 11;
      }
    }
  }
}
</style>
