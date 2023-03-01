<template>
  <div class="app-container">
    <div class="apply-box" v-if="viewType == 'view' || viewType == 'apply'">
      <aduitList />
      <aduitForm v-if="viewType == 'apply'" class="aduit-form" />
    </div>
    <!-- 新增编辑申请表 -->
    <div class="edit-box" v-if="viewType == 'edit'">
      <h2 class="">申请表</h2>
      <applyForm :id="id" type="edit" />
    </div>
    <div class="view-box" v-if="viewType == 'view' || viewType == 'apply'">
      <el-tabs v-model="activeTab" class="demo-tabs">
        <el-tab-pane label="申请表" name="apply">
          <applyForm :id="id" type="view" />
        </el-tab-pane>
        <el-tab-pane label="价值核算表" name="price">
          <priceForm :id="id" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-button
      @click="openEditRecord"
      class="record-btn apply-record"
      type="primary"
      plain
      v-if="viewType == 'edit' && id"
      >编<br />辑<br />记<br />录<br />&nbsp;&nbsp;》</el-button
    >
    <el-button
      @click="openApplyRecord"
      class="record-btn edit-record"
      type="primary"
      plain
      v-if="id"
      >驳<br />回<br />记<br />录<br />&nbsp;&nbsp;》</el-button
    >

    <applyRecordDrawer ref="applyRecordRef" />
    <editRecordDrawer ref="editRecordRef" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRoute } from "vue-router";
import applyForm from "./applyForm.vue";
import aduitList from "./aduitList.vue";
import aduitForm from "./aduitForm.vue";
import priceForm from "./priceForm.vue";
import applyRecordDrawer from "./components/applyRecordDrawer.vue";
import editRecordDrawer from "./components/editRecordDrawer.vue";
const route = useRoute();
console.log("type", route.params.type);
let viewType = ref<any>("view");
const id = ref(String(route.query.id || ""));
if (route.params?.type) {
  viewType.value = route.params.type || "";
}

const activeTab = ref("apply");

const applyRecordRef = ref<null | InstanceType<typeof applyRecordDrawer>>(null);
const editRecordRef = ref<null | InstanceType<typeof editRecordDrawer>>(null);
const openApplyRecord = () => {
  applyRecordRef.value?.openDrawer(id.value);
};
const openEditRecord = () => {
  editRecordRef.value?.openDrawer(id.value);
};
</script>

<style scoped lang="scss">
@use "@/styles/common.scss";
.app-container {
  padding: 20px 40px;
  position: relative;
  .aduit-form {
    margin: 0 auto;
  }
  .record-btn {
    position: fixed;
    right: 20px;
    bottom: 230px;
    width: 48px;
    height: 130px;
    line-height: 20px;
    padding: 10px 16px;
    z-index: 1;
    &.edit-record {
      bottom: 80px;
    }
  }
}
</style>
