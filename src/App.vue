<template>
  <div id="app">
    <!--    <EVirTable />-->
    <Tabulator />
    <Stickright />
  </div>
</template>
<script setup lang="ts">
import EVirTable from './views/eVirtTable.vue'
import Tabulator from './views/tabulator.vue'
import Stickright from './views/stickright.vue';
</script>
<style>
body {
  width: 100%;
  height: 100%;
  margin: 0px;
  box-sizing: border-box;
  outline: none;
  padding: 8px;
}

#app {
  width: 100%;
  height: 100%;
}
</style>
