# DataGridView - e-virt-table Vue3组件封装

## 简介
DataGridView是对[e-virt-table](https://github.com/laichuangwen/e-virt-table)的Vue3组件封装，提供了更加符合Vue3开发习惯的表格组件，支持虚拟滚动、单元格编辑、自定义编辑器等功能。

## 特性
- 基于Canvas的高性能表格渲染
- 支持虚拟滚动，可处理大量数据
- 丰富的单元格编辑功能，支持多种编辑器类型
- 灵活的自定义样式和主题配置
- 完整的事件系统
- 支持覆盖层视图自定义

## 安装
```bash
npm install e-virt-table
# 或
yarn add e-virt-table
# 或
pnpm install e-virt-table
```

## 基本使用
```vue
<template>
  <DataGridView
    :columns="columns"
    :data="data"
    :config="config"
    :loading="loading"
    @change="handleChange"
    @ready="handleReady"
  />
</template>

<script lang="ts" setup>
import DataGridView from '@/components/DataGridView'
import type { Column, ConfigType, EVirtTable } from 'e-virt-table'

const columns = ref<Column[]>([
  {
    key: 'name',
    label: '名称',
    width: 120,
  },
  {
    key: 'age',
    label: '年龄',
    width: 80,
    editorType: 'number',
    editorProps: {
      min: 0,
      max: 120,
    },
  },
  {
    key: 'gender',
    label: '性别',
    width: 80,
    editorType: 'select',
    editorProps: {
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' },
      ],
    },
  },
])

const data = ref([
  { name: '张三', age: 18, gender: 'male' },
  { name: '李四', age: 22, gender: 'female' },
  // 更多数据...
])

const config = ref<ConfigType>({
  ENABLE_SELECTOR: true,
  ENABLE_CONTEXT_MENU: true,
})

const loading = ref(false)

const handleChange = (newData: any[]) => {
  console.log('数据已更新:', newData)
}

const handleReady = (tableInstance: EVirtTable) => {
  console.log('表格已准备就绪:', tableInstance)
}
</script>
```

## Props

| 参数名 | 类型 | 说明 | 是否必填 | 默认值 |
|-------|------|------|---------|-------|
| columns | Column[] | 列配置数组 | 是 | [] |
| data | any[] | 表格数据数组 | 是 | [] |
| footerData | any[] | 底部数据数组 | 否 | [] |
| config | ConfigType | 表格配置对象 | 否 | {} |
| loading | boolean | 加载状态 | 否 | false |

## Events

| 事件名 | 说明 | 回调参数 |
|-------|------|---------|
| change | 表格数据变化时触发 | (value: any[]) => void |
| ready | 表格初始化完成时触发 | (tableInstance: EVirtTable) => void |
| 其他事件 | 支持e-virt-table所有原生事件，使用小驼峰命名 | 事件原生参数 |

## 编辑器类型

DataGridView内置了以下几种编辑器类型：

1. **number**：数字输入编辑器，用于编辑数字类型的数据
2. **select**：下拉选择编辑器，用于从预定义选项中选择
3. **customInput**：自定义输入编辑器，使用Vue组件实现

### 自定义编辑器

要使用自定义编辑器，需要在columns配置中指定editorType和editorProps：

```typescript
const columns = ref<Column[]>([
  {
    key: 'customField',
    label: '自定义字段',
    width: 200,
    editorType: 'customInput',
    // editorProps会传递给自定义编辑器组件
  },
])
```

## 自定义编辑器开发

如果需要开发自己的编辑器，可以继承EVirtTableEditor类：

```typescript
import { EVirtTableEditor } from './EVirtTableEditor'
import type Cell from 'e-virt-table/dist/lib/Cell'

export default class MyCustomEditor extends EVirtTableEditor {
  constructor(table: EVirtTable) {
    super({
      name: 'my-custom-editor',
      type: 'input',
      table
    })
  }

  createElement(cell: Cell) {
    // 创建编辑器DOM元素
    const editorElement = document.createElement('div')
    // 设置样式和初始值
    return editorElement
  }

  onMounted(el: HTMLElement) {
    // 编辑器挂载后的处理
    // 绑定事件等
  }
}
```

然后在组件中注册并使用：

```vue
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import DataGridView from '@/components/DataGridView'
import type { EVirtTable } from 'e-virt-table'
import MyCustomEditor from './MyCustomEditor'

let tableInstance: EVirtTable | null = null

onMounted(() => {
  // 注册自定义编辑器
  tableInstance?.registerEditor('myCustom', MyCustomEditor)
})
</script>
```

## 主题配置

DataGridView使用theme.ts文件定义了默认的主题配置，可以通过props中的config参数覆盖这些配置：

```typescript
const config = ref({
  // 覆盖默认的背景色
  HEADER_BG_COLOR: '#f0f2f5',
  // 覆盖边框颜色
  BORDER_COLOR: '#e8e8e8',
  // 启用行高调整
  ENABLE_RESIZE_ROW: true,
})
```

## 常见问题

### 1. 如何获取表格实例？
可以通过@ready事件获取表格实例：

```vue
<DataGridView @ready="handleReady" />

<script setup>
const handleReady = (tableInstance) => {
  // 保存表格实例用于后续操作
  this.tableInstance = tableInstance
}
</script>
```

### 2. 如何动态调整列宽？
可以通过表格实例的方法调整列宽：

```typescript
tableInstance?.resizeColumn('columnKey', 200)
```

或者通过配置启用用户拖动调整列宽：

```typescript
const config = ref({
  ENABLE_RESIZE_COLUMN: true,
})
```

### 3. 如何实现自定义单元格渲染？
可以通过覆盖层视图实现自定义单元格渲染，具体请参考e-virt-table的官方文档。

## 更多信息
- [e-virt-table 官方仓库](https://github.com/laichuangwen/e-virt-table)
- [e-virt-table Vue3示例](https://github.com/laichuangwen/e-virt-table-vue3)