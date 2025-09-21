<template>
  <div style="width: 1000px; height: 600px">
    <DataGridView2 :columns="columns" :data="tableData" />
  </div>
</template>
<script setup lang="ts">
import DataGridView2 from '@/components/DataGridView2/index.vue'
import type { DataGridViewColumn } from '@/components/DataGridView2/types'

const columnMaker = (count: number) => {
  const cols: DataGridViewColumn[] = []
  for (let i = 0; i < count; i++) {
    cols.push({
      title: `col${i}`,
      field: `col${i}`,
      width: 100,
      // frozen: i < 3,
      frozen: i < 3 || i > count - 5
    })
  }

  return cols
}

const dataMaker = (cols: DataGridViewColumn[], length: number) => {
  const data: any[] = []
  for (let i = 0; i < length; i++) {
    const row: Record<string, any> = {}
    for (let i = 0; i < cols.length; i++) {
      row[cols[i].field!] = cols[i].field
    }

    data.push(row)
  }

  return data
}

const columns: DataGridViewColumn[] = columnMaker(30)

const tableData = dataMaker(columns, 10000)
</script>
