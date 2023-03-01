<template>
  <div class="apply-record-box">
    <el-drawer
      v-model="drawer"
      direction="rtl"
      @closed="handleClose"
      size="500px"
    >
      <template #header>
        <h3 class="edit-header">驳回记录</h3>
      </template>
      <el-table :data="editRecordList">
        <el-table-column prop="createTime" width="180px" label="时间">
          <template #default="scope">
            {{ parseTime(scope.row.createTime, "{y}.{m}.{d} {h}:{i}:{s}") }}
          </template>
        </el-table-column>
        <el-table-column prop="createName" label="姓名" />

        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <span :class="`status_${scope.row.status}`">{{
              searchDictByValue(aduitType, scope.row.status)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="原因" />
      </el-table>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { aduitType } from "@/shared/dict/constant";
import { searchDictByValue } from "@/shared/dict";
import { parseTime } from "@/shared/util";
import { queryAuditRecord } from "@/services/apply";

const drawer = ref(false);
const editRecordList = ref([]);
const openDrawer = (id: string, type = 0) => {
  console.log(id);
  drawer.value = true;
  queryAuditRecord({
    approvalApplyId: id,
    type,
  }).then((res) => {
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
.apply-record-box {
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
