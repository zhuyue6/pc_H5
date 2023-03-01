<template>
  <div class="table-cell">
    <el-tooltip placement="top" effect="dark" :hide-after="0" :content="text">
      <div class="table-cell-content">
        {{ text }}
      </div>
    </el-tooltip>
  </div>
</template>
<script lang="ts" setup>
defineProps(["text"]);
</script>
<style lang="scss" scoped>
@use "@/styles/common";
.table-cell {
  @include common.flex(flex-start);
  width: 100%;
  .table-cell-content {
    @include common.overflowEllipsis;
  }
}
</style>
