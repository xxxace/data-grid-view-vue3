<template>
  <div class="scroll-container">
    <div class="scroll-wrapper">
      <div v-for="i in 13" :key="i" class="scroll-item">{{ i }}</div>
      <div class="scroll-item sticky-item-1">14</div>
      <div class="scroll-item sticky-item-2">15</div>
      <div class="scroll-item sticky-item-3">16</div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 组件逻辑部分（简单示例无需复杂逻辑）
</script>

<style scoped lang="scss">
.scroll-container {
  width: 800px;
  height: 68px;
  position: relative;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: scroll;
}

.scroll-wrapper {
  height: 100%;
  // display: flex;
  position: relative;
  white-space: nowrap;
}

.scroll-item {
  width: 100px;
  height: 100%;
  display: inline-block;
  background-color: #f5f5f5;
  border-right: 1px solid #e0e0e0;
  font-size: 14px;
  color: #333;

  &:last-child {
    border-right: none;
  }
}

// 最后三个元素的sticky定位
.sticky-item-1 {
  position: sticky;
  right: 200px; // 第三个元素的宽度 + 第二个元素的宽度
  left: 0;
  background-color: #e3f2fd;
  z-index: 1;
}

.sticky-item-2 {
  position: sticky;
  right: 100px; // 第三个元素的宽度
  left: 0;
  background-color: #e8f5e9;
  z-index: 2;
}

.sticky-item-3 {
  position: sticky;
  left: 0;
  right: 0;
  background-color: #fff3e0;
  z-index: 3;
}
</style>
