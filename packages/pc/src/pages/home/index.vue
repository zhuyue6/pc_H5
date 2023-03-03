<template>
  <el-container>
    <el-header v-if="hiddenHeader">
      <cHeader />
    </el-header>
    <el-container>
      <cNavigator />
      <el-main>
        <div class="child-page">
          <router-view v-slot="{ Component }">
            <keep-alive v-if="$route.meta.keepAlive">
              <component :is="Component" :key="$route.name" v-if="!loading" />
            </keep-alive>
            <template v-else>
              <component :is="Component" :key="$route.name" v-if="!loading" />
            </template>
          </router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import cHeader from "./header.vue";
import cNavigator from "./navigator.vue";
import { util } from "@/shared";
import { shallowRef, onMounted } from "vue";
import { requests } from "@/services/home";
const hiddenHeader = shallowRef<boolean>(true);

let loading = shallowRef(true);
onMounted(() => {
  hiddenHeader.value = util.getUrlQuery("hiddenModules") !== "header";

  // 所有前置请求结束后再渲染数据
  requests().finally(() => {
    loading.value = false;
  });
});
</script>
<style lang="scss" scoped>
::v-deep {
  .el-header {
    padding: 0;
    height: 56px;
  }
  .el-main {
    background-color: #f4f6f9;
    .child-page {
      width: 100%;
      height: 100%;
      min-width: 960px;
      background-color: #fff;
      box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.06);
    }
  }
}
</style>
