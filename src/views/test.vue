<template>
  <div id="e-virt-table"></div>
</template>

<script setup>
import {onMounted} from 'vue'
import EVirtTable from 'e-virt-table'
import Theme from '../components/DataGridView/config/theme'
let data = [
  {
    id: '1',
    date: '2016-05-03',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    id: '2',
    date: '2016-05-02',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    id: '3',
    date: '2016-05-04',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    id: '4',
    date: '2016-05-01',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    id: '5',
    date: '2016-05-08',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    id: '6',
    date: '2016-05-06',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    id: '7',
    date: '2016-05-07',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
];
let columns = [
  {
    type: 'selection',
    key: 'selection',
    width: 30,
    title: '',
    align: 'center',
    fixed: 'left',
    overflowTooltipHeaderShow: false
  },
  {
    title: 'Date',
    key: 'date',
    readonly: true,
  },
  {
    title: 'Name',
    key: 'name',
    readonly: true,
  },
  {
    title: 'State',
    key: 'state',
    readonly: true,
  },
  {
    title: 'City',
    key: 'city',
    readonly: true,
  },
  {
    title: 'Address',
    key: 'address',
    readonly: true,
    width: 200,
  },
  {
    title: 'Zip',
    key: 'zip',
    readonly: true,
  },
];


onMounted(()=>{
  const target = document.getElementById('e-virt-table');
  const grid = new EVirtTable(target, {
    data,
    columns,
    config:{
      // ...Theme.editTable
    }
  });
  grid.on('selectionChange', (selection) => {
    console.log('selectionChange', selection);
  });
})
</script>
