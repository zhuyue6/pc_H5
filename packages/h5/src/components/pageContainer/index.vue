<template>
  <div class="page-container">
    <div class="page-container-content">
      <slot></slot>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@use "@/styles/common";
.page-container {
  width: 100%;
  @include common.flex;
  .page-container-content {
    width: 100%;
    max-width: 750px;
  }
}
</style>
