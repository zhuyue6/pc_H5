<template>
  <div class="edit-record-box">
    <el-drawer
      v-model="drawer"
      direction="rtl"
      @closed="handleClose"
      size="500px"
    >
      <template #header>
        <h3 class="edit-header">编辑记录</h3>
      </template>
      <el-table :data="editRecordList">
        <el-table-column prop="id" label="事件ID" />
        <el-table-column prop="operateType" label="编辑类型">
          <template #default="scope">
            <span :class="`status_${scope.row.operateType}`">{{
              searchDictByValue(editType, scope.row.operateType)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" width="180px" label="编辑时间">
          <template #default="scope">
            {{ parseTime(scope.row.createTime, "{y}.{m}.{d} {h}:{i}:{s}") }}
          </template>
        </el-table-column>

        <el-table-column prop="createName" label="编辑人" />
      </el-table>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { editType } from "@/shared/dict/constant";
import { searchDictByValue } from "@/shared/dict";
import { getApprovalApplyEditList } from "@/services/apply";
import { parseTime } from "@/shared/util";

const drawer = ref(false);
const editRecordList = ref([]);
const openDrawer = (id: string) => {
  console.log(id);
  drawer.value = true;
  getApprovalApplyEditList({
    approvalApplyId: id,
  }).then((res) => {
    console.log(res);
    editRecordList.value = res;
  });
};

const handleClose = () => {
  drawer.value = false;
};
defineExpose({
  openDrawer,
});
</script>

<style scoped lang="scss">
.edit-record-box {
  .el-drawer {
    color: red;
  }
  :deep(.el-drawer__header) {
    margin-bottom: 0;
    border-bottom: 1px solid #e9e9e9;
    padding-bottom: 20px;
  }
  .edit-header {
    font-size: 14px;
    color: #333333;
    line-height: 20px;
    margin: 0;
  }
  .status_1 {
    color: #00b631;
  }
  .status_2 {
    color: #ff7300;
  }
  .status_3 {
    color: #1890ff;
  }
}
</style>
