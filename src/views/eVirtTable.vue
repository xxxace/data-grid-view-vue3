<script lang="ts" setup>
import { faker } from '@faker-js/faker'
import dayjs from 'dayjs'
import type { Column, ConfigType, RowParams } from 'e-virt-table'
import EVirtTable from 'e-virt-table'
import EVirtTableVue from '../components/DataGridView/index.vue'
import { onMounted, ref } from 'vue'

const editorTypes = ['text', 'select', 'date']
let columns = ref<Column[]>([
  {
    type: 'selection',
    key: 'selection',
    width: 30,
    title: '',
    align: 'center',
    // operation: true,
    fixed: 'left',
    // overflowTooltipHeaderShow: false
  },
  {
    type: 'index',
    key: 'index',
    width: 56,
    title: '#',
    operation: true,
    align: 'center',
    fixed: 'left',
  },
  {
    title: 'name',
    key: 'name',
    align: 'left',
    // width: 160
  },
  {
    title: 'email',
    key: 'email',
    width: 160,
    align: 'left',
  },
  {
    title: 'customType',
    key: 'customType',
    width: 80,
  },
  {
    title: 'custom',
    key: 'custom',
    width: 70,
  },
  {
    title: 'text',
    key: 'text',
    width: 70,
    editorType: 'customInput',
  },
  {
    title: 'select',
    key: 'select',
    width: 70,
    editorType: 'select',
    editorProps: {
      filterable: true,
      options: [
        { label: 'male', value: 'male' },
        { label: 'female', value: 'female' },
      ],
    },
  },
  {
    title: 'number',
    key: 'number',
    editorType: 'number',
    align: 'right',
    width: 70,
    rules: [{ required: false, type: 'number', message: 'Please input' }],
  },
  {
    title: 'amount',
    key: 'amount',
    width: 80,
    editorType: 'number',
    formatter: ({ row }) => {
      const formatter = new Intl.NumberFormat('zh-CN', {
        style: 'currency',
        currency: 'CNY',
        minimumFractionDigits: 2, // 保留两位小数
      })
      return row.amount ? formatter.format(row.amount) : ''
    },
    editorProps: {
      precision: 2,
      min: 0,
      max: 100000,
    },
    align: 'right',
  },
  {
    title: 'years',
    key: 'years',
    width: 60,
    align: 'center',
    editorType: 'date',
    editorProps: {
      type: 'year',
      valueFormat: 'YYYY',
    },
  },
  {
    title: 'month',
    key: 'month',
    width: 80,
    align: 'center',
    editorType: 'date',
    editorProps: {
      type: 'month',
      valueFormat: 'YYYY-MM',
    },
  },
  {
    title: 'date',
    key: 'date',
    width: 80,
    editorType: 'date',
  },
  {
    title: 'time',
    key: 'time',
    width: 80,
    editorType: 'time',
  },
])
const users = faker.helpers.multiple(
  () => {
    return {
      uuid: faker.string.uuid(),
      name: faker.person.fullName(),
      avatar: faker.image.avatar(),
      image: faker.image.url(),
      customType: editorTypes[faker.number.int({ min: 0, max: editorTypes.length - 1 })],
      select: faker.person.sex(),
      number: faker.number.int({ min: 24, max: 66 }),
      amount: faker.number.int({ min: 0, max: 10000 }),
      date: dayjs(faker.date.recent()).format('YYYY-MM-DD'),
      years: dayjs(faker.date.anytime()).format('YYYY'),
      month: dayjs(faker.date.anytime()).format('YYYY-MM'),
      time: dayjs(faker.date.anytime()).format('HH:mm:ss'),
      cascader: faker.number.int({ min: 1, max: 4 }),
      email: faker.internet.email(),
    }
  },
  {
    count: 15000,
  },
)
const config: ConfigType = {
  // WIDTH: 20000,
  HEIGHT: 600,
  BEFORE_VALUE_CHANGE_METHOD: (changeList) => {
    // 数字类型需要特殊处理，粘贴的内容可能不是数字或字符串的数字
    return changeList.map((item) => {
      if (item.key === 'number') {
        if (/^-?\d+(\.\d+)?$/.test(item.value)) {
          return {
            ...item,
            value: Number(item.value),
          }
        }
      }
      return item
    })
  },
  BODY_CELL_EDITOR_METHOD: ({ column, row }) => {
    if (column.key === 'custom') {
      if (row.customType === 'select') {
        return {
          type: 'select',
          props: {
            filterable: true,
            options: [
              { label: 'male', value: 'male' },
              { label: 'female', value: 'female' },
            ],
          },
        }
      } else if (row.customType === 'date') {
        return {
          type: 'date',
          props: {
            type: 'date',
            valueFormat: 'YYYY-MM-DD',
          },
        }
      }
    }
  },
}

const currentRow = ref<any>({})

function change(data: any) {
  console.log(data)
}

let evirtTable: EVirtTable | null = null

function ready(grid: EVirtTable) {
  evirtTable = grid
}

const handleCurrentRowChange = (row: any, rowParams: RowParams | undefined) => {
  console.log('handleCurrentRowChange', row, rowParams)
  currentRow.value = row || {}
}

onMounted(() => {
  console.log('onMounted', users)
})
</script>
<template>
  <div style="width: 100%; height: 600px; overflow: hidden">
    <!-- <div style="margin-bottom: 8px">
      {{ currentRow }}
    </div> -->
    <EVirtTableVue
      @ready="ready"
      :columns="columns"
      :data="users"
      :config="config"
      @change="change"
      @current-row-change="handleCurrentRowChange"
    >
    </EVirtTableVue>
  </div>
</template>
