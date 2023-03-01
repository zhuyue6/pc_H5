<template>
  <el-dialog
    v-model="dialogVisible"
    title="数据导出"
    width="30%"
    :before-close="handleClose"
  >
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleExport">导出</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { exportApplyList } from "@/services/apply";

const dialogVisible = ref<boolean>(false);
const state = reactive({
  startTime: "",
  endTime: "",
  regionCodes: [],
});

const openDialog = () => {
  dialogVisible.value = true;
};

const handleExport = () => {
  exportApplyList(state).then((res) => {
    console.log(res);
  });
};

defineExpose({
  openDialog,
});
</script>

<style scoped lang="scss"></style>
