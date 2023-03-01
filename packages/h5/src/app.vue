<template>
  <div class="root">
    <div class="nav">
      <van-nav-bar :title="commonStore.navTitle" />
    </div>
    <div class="page-container">
      <router-view />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useCommonStore } from "@/store";
const commonStore = useCommonStore();
</script>
<style lang="scss" scoped>
@use "@/styles/common";
.root {
  width: 100%;
  height: 100%;
  @include common.flex(flex-start, center, column);
  .nav {
    width: 100%;
  }
  .page-container {
    width: 100%;
    height: 100%;
  }
}
</style>
