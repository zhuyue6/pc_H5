<template>
  <div class="director-manage-container">
    <div class="filter-container">
      <div class="button-container">
        <el-button
          type="primary"
          :icon="Plus"
          @click="addDirector"
          v-if="state.hasAddPermission"
          >新增</el-button
        >
      </div>
      <div class="option-container">
        <div class="option-item">
          <text class="option-item-text">区域名称：</text>
          <el-cascader
            :show-all-levels="false"
            :props="{
              checkStrictly: true,
            }"
            v-model="state.filterParams.country"
            :options="countryOptions"
          />
        </div>
        <div class="option-item">
          <text class="option-item-text">姓名：</text>
          <el-input
            v-model="state.filterParams.name"
            placeholder="请输入姓名"
          />
        </div>
        <div class="option-item">
          <text class="option-item-text">手机号：</text>
          <el-input
            v-model="state.filterParams.phone"
            placeholder="请输入手机号"
          />
        </div>
        <div class="option-item">
          <text class="option-item-text">状态：</text>
          <el-select v-model="state.filterParams.status" placeholder="全部">
            <el-option
              v-for="item in state.filterParams.statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="option-item">
          <text class="option-item-text">角色：</text>
          <el-select v-model="state.filterParams.role" placeholder="全部">
            <el-option
              v-for="item in roleList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <el-button class="filter-button" type="primary" plain @click="search"
          >搜索</el-button
        >
      </div>
    </div>
    <div class="data-home-table">
      <div class="data-home-table-content">
        <cTable :fetch-data="fetchData" ref="cTableRef" :mountedGetData="false">
          <template #columns>
            <el-table-column
              :key="column.prop"
              :="column"
              v-for="column of columns"
            >
              <template #default="{ row }">
                <textEllipsis
                  v-if="column.prop === 'areaText'"
                  :text="util.getUserInfoAreasText(row)"
                >
                </textEllipsis>
                <textEllipsis
                  v-if="column.prop === 'approverRole'"
                  :text="util.roleTextByApproverRole(row.approverRole)"
                />
                <textEllipsis
                  v-else-if="column.prop === 'createTime'"
                  :text="util.parseTime(row.createTime)"
                />
                <textEllipsis
                  v-else-if="column.prop === 'updateTime'"
                  :text="util.parseTime(row.updateTime)"
                />
                <textEllipsis
                  v-else-if="column.prop === 'status'"
                  :text="
                    auditors
                      .map((auditor) => auditor.value)
                      .includes(row.approverRole)
                      ? row.status === 0
                        ? '禁用'
                        : '启动'
                      : '-'
                  "
                />
                <span
                  class="edit"
                  v-else-if="column.prop === 'edit'"
                  @click="edit(row)"
                  >编辑</span
                >
                <el-switch
                  v-else-if="
                    column.prop === 'switch' &&
                    auditors
                      .map((auditor) => auditor.value)
                      .includes(row.approverRole)
                  "
                  :modelValue="row.status === 1"
                  @update:modelValue="($event: boolean) => enableDirector($event, row)"
                ></el-switch>
                <textEllipsis v-else :text="row[column.prop]" />
              </template>
            </el-table-column>
          </template>
        </cTable>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, reactive, ref, onMounted } from "vue";
import { cTable } from "@/components";
import { Plus } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { getAccountList, setAccountStatus } from "@/services/directorManage";
import { type UserInfo } from "@/services/login";
import { ElMessage } from "element-plus";
import textEllipsis from "@/components/cTable/textEllipsis.vue";
import { directorStatus, type Options } from "@/shared/dict/constant";
import { useCommonStore } from "@/store";
import { isAdmin } from "@/services/permission";
import { util } from "@/shared";
import {
  auditors,
  townManager,
  areaManager,
  villageManager,
  approverRole,
} from "@/shared/dict/constant";

interface State {
  filterParams: {
    country: string[];
    statusList: Options[];
    name: string;
    phone: string;
    status: string;
    role: string;
  };
  hasAddPermission: boolean;
}

const state: State = reactive({
  filterParams: {
    country: [],
    role: "",
    statusList: [
      {
        label: "全部",
        value: "",
      },
    ].concat(directorStatus),
    name: "",
    phone: "",
    status: "",
  },
  hasAddPermission: true,
});

const commonStore = useCommonStore();

const countryOptions = computed(() => {
  const userIdentity = util.getUserIdentity();
  let disabled = [1, 2];
  if (isAdmin()) {
    disabled = [];
  } else if (userIdentity === 4) disabled = [1, 2, 3, 4];
  else if (userIdentity === 5) disabled = [1, 2, 3, 4, 5];
  return util.formatRegion(commonStore.regions, disabled);
});

const roleList = computed(() => {
  const userInfo = util.getUserInfo();
  let list: any[] = [];
  // 如果是区县负责人
  if (isAdmin()) {
    list = approverRole;
  } else if (userInfo.approverRole === 60) {
    list = areaManager;
  } else if (userInfo.approverRole === 40) {
    list = townManager;
  } else if (userInfo.approverRole === 20) {
    list = villageManager;
  }
  return [
    {
      label: "全部",
      value: "",
    },
  ].concat(list);
});

async function fetchData(currentPage: number, pageSize: number) {
  const approverRoles =
    state.filterParams.role === ""
      ? roleList.value
          .filter((item) => item.value !== "")
          .map((item) => item.value)
      : [state.filterParams.role];
  const params = {
    currentPage,
    pageSize,
    areaCode: "",
    townCode: "",
    villageCode: "",
    provinceCode: "",
    cityCode: "",
    approverRoles,
    status: state.filterParams.status,
    username: state.filterParams.name,
    mobile: state.filterParams.phone,
  };
  // 1省|2市|3区县|4街道/乡镇|5村
  const formatRegions = util.getAreasInfo(
    state.filterParams.country,
    countryOptions.value
  );
  for (const formatRegion of formatRegions) {
    if (formatRegion.level === 1) {
      params.provinceCode = formatRegion.value;
    }
    if (formatRegion.level === 2) {
      params.cityCode = formatRegion.value;
    }
    if (formatRegion.level === 3) {
      params.areaCode = formatRegion.value;
    }
    if (formatRegion.level === 4) {
      params.townCode = formatRegion.value;
    }
    if (formatRegion.level === 5) {
      params.villageCode = formatRegion.value;
    }
  }
  const accountData = await getAccountList(params);
  return {
    total: accountData?.total,
    list: accountData?.records ?? [],
  };
}

const columns = [
  {
    prop: "id",
    label: "ID",
  },
  {
    prop: "areaText",
    label: "负责区域",
    width: "100",
  },
  {
    prop: "approverRole",
    label: "角色",
    width: "100",
  },
  {
    prop: "username",
    label: "姓名",
    width: "100",
  },
  {
    prop: "mobile",
    label: "手机号",
    width: "120",
  },
  {
    prop: "status",
    label: "状态",
  },
  {
    prop: "createTime",
    label: "创建时间",
    width: "180",
  },
  {
    prop: "updateTime",
    label: "最近编辑",
    width: "180",
  },
  {
    prop: "edit",
    label: "操作",
  },
  {
    prop: "switch",
  },
];

const router = useRouter();

const cTableRef = ref<typeof cTable | null>(null);

let enableDirectorLoading = false;
function enableDirector(enable: boolean, item: UserInfo) {
  if (util.isUserDisabled(item.approverRole) && enable === false) {
    return ElMessage({
      message: "村务员和各级负责人无法禁用",
      type: "warning",
    });
  }
  if (enableDirectorLoading) return;
  enableDirectorLoading = true;
  setAccountStatus({
    id: item.id,
    status: enable ? 1 : 0,
  }).then(() => {
    ElMessage({
      message: "操作成功",
      type: "success",
    });
    cTableRef.value?.refresh();
    enableDirectorLoading = false;
  });
}

function search() {
  cTableRef.value?.refresh();
}

function edit(item: UserInfo) {
  router.push({
    path: "/home/directorManageInfo",
    query: {
      id: item.id,
    },
  });
}

function addDirector() {
  router.push({
    path: "/home/directorManageInfo",
  });
}

onMounted(() => {
  state.filterParams.country = util.getUserInfoDefaultAreas();
  const userInfo = util.getUserInfo();
  state.hasAddPermission =
    [60, 40].includes(userInfo.approverRole) || isAdmin();
  search();
});
</script>

<style lang="scss" scoped>
@use "@/styles/common";
@use "@/styles/index";
.director-manage-container {
  padding: 16px 0 16px 16px;
  width: 100%;
  height: 100%;
  @include common.flex(center, center, column);
  .filter-container {
    width: 100%;
    .button-container {
      display: flex;
      width: 100%;
      .add-button {
        height: 32px;
        cursor: pointer;
        @include common.flex(center, center);
        background-color: index.$primaryColor;
        padding: 0 16px;
        border-radius: 2px;
        .add-button-text {
          margin-left: 5px;
          font-size: 14px;
          color: #fff;
        }
      }
    }
    .option-container {
      @include common.flex(flex-start);
      flex-wrap: wrap;
      .option-item {
        margin-top: 16px;
        margin-left: 32px;
        &:first-child {
          margin-left: 0;
        }
        @include common.flex();
        .option-item-text {
          flex-shrink: 0;
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: #333333;
        }
      }
      .filter-button {
        flex-shrink: 0;
        margin-top: 16px;
        margin-left: 27px;
        margin-right: 21px;
      }
    }
  }
  .edit {
    cursor: pointer;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #1890ff;
    line-height: 22px;
  }
  .data-home-table {
    width: 100%;
    height: 100%;
    margin-top: 32px;
    padding-right: 16px;
    @include common.flex(space-between, flex-end, column);
    .data-home-table-content {
      width: 100%;
      height: 0;
      flex-grow: 1;
    }
  }
}
</style>
