<template>
  <div class="app-container">
    <el-button
      v-if="userinfo?.approverRole == 0"
      type="primary"
      @click="jumpApplyForm('edit')"
      :icon="Plus"
      >新增</el-button
    >
    <div class="search-wrap">
      <el-form :model="searchData" inline>
        <el-form-item label="申请人">
          <el-input
            placeholder="姓名/手机号/申请编号"
            v-model="searchData.keyword"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="onSearch">搜索</el-button>
          <el-button type="primary" plain @click="openExportDialog"
            >导出</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="table-box">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="申请编号" />
        <el-table-column prop="name" label="户主" />
        <el-table-column prop="mobile" label="手机号" width="120px" />
        <el-table-column prop="address" label="地区" width="200px" />
        <el-table-column
          prop="exitEligibilityArea"
          label="拟退房屋建筑面积(㎡)"
          width="180px"
        />
        <el-table-column
          prop="exitArea"
          label="拟退宅基地建筑占地(㎡)"
          width="180px"
        />
        <el-table-column prop="placementMethod" label="安置方式" width="80px" />

        <el-table-column prop="status" label="审核状态">
          <template #default="scope">
            {{ searchDictByValue(dict.applyStatusDict, scope.row.status) }}
          </template>
        </el-table-column>

        <el-table-column prop="op" label="操作" min-width="260px">
          <template #default="scope">
            <el-button
              type="success"
              text
              @click="jumpApplyForm('edit', scope.row.id)"
              v-if="[10, 40].includes(Number(scope.row.status))"
              >编辑</el-button
            >
            <el-button
              type="primary"
              text
              @click="jumpApplyForm('view', scope.row.id)"
              >查看</el-button
            >
            <el-button
              type="primary"
              text
              @click="openAduitForm(scope.row.id)"
              v-if="
                [30, 40].includes(Number(scope.row.status)) &&
                [50, 60].includes(Number(userinfo?.approverRole || 0))
              "
              >修正审核意见</el-button
            >

            <el-button
              type="primary"
              text
              @click="onApplySubmit(scope.row.id)"
              v-if="[10].includes(Number(scope.row.status))"
              >提交</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination-box">
      <el-pagination
        v-model:current-page="searchData.page"
        v-model:page-size="searchData.pageSize"
        :page-sizes="[10, 20, 30, 50]"
        background
        layout="prev, pager, next, sizes, jumper"
        :total="total"
        @size-change="refresh"
        @current-change="onSearch"
      />
    </div>

    <exportFileDialog ref="exportFileDialogRef" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Plus } from "@element-plus/icons-vue";
import * as dict from "@/shared/dict/constant";
import { searchDictByValue } from "@/shared/dict";
import {
  applyList,
  queryApprovalApplyList,
  submitApply,
  QueryListItem,
} from "@/services/apply";
import exportFileDialog from "./components/exportFileDialog.vue";
import { getUserInfo, UserInfo as UserInfoType } from "@/services/login";

const router = useRouter();
const route = useRoute();
const userinfo = ref<UserInfoType>();
// 搜索
const searchData = reactive({
  keyword: "",
  page: 1,
  pageSize: 10,
  status: route.query.status || "",
});
const total = ref<number>(0);
// 表格数据
let tableData = ref<QueryListItem[]>([]);
const onSearch = () => {
  if (userinfo.value?.approverRole == 0) {
    queryApprovalApplyList(searchData).then((res) => {
      console.log(res);
      tableData.value = res ? res.result : [];
      total.value = res.total;
    });
  } else {
    applyList(searchData).then((res) => {
      console.log(res);
      tableData.value = res ? res.result : [];
      total.value = res.total;
    });
  }
};

const refresh = () => {
  searchData.page = 1;
  onSearch();
};

console.log(route.query);
console.log(route.matched);

watch(
  () => router.currentRoute.value.path,
  () => {
    console.log(searchData.status, route.query);
    const newStatus = route.query.status;
    if (searchData.status != newStatus && newStatus) {
      console.log("refresh");
      searchData.status = String(newStatus);
      refresh();
    }
  },
  { deep: true }
);

onMounted(() => {
  userinfo.value = getUserInfo();
  onSearch();
});

// 跳转 新增、编辑、审批
const jumpApplyForm = (type: string, id?: string | number) => {
  let url = `/application/apply/${type}`;
  let query = {};
  if (id) {
    query.id = id;
  }
  router.push({
    path: url,
    query,
  });
};

// 县级审核员重新修改审核内容
const openAduitForm = (data) => {
  console.log(data);
};

// 提交申请
const onApplySubmit = (id: any) => {
  console.log(id);
  submitApply({
    approvalApplyId: id,
  }).then((res) => {
    console.log(res);
  });
};

const exportFileDialogRef = ref();
const openExportDialog = () => {
  exportFileDialogRef.value?.openDialog();
};
</script>

<style scoped lang="scss">
@use "@/styles/common";
.app-container {
  padding: 20px 40px;
  min-height: 100%;
  @include common.flex(center, flex-start, column);
  // overflow-x: hidden;
  .search-wrap {
    margin-top: 24px;
  }
  .table-box {
    flex: 1;
  }
}
.pagination-box {
  width: 100%;
  @include common.flex(end, flex-end, row);
}
</style>
