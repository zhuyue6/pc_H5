<template>
  <div class="table-container">
    <div class="table-content" ref="tableRef">
      <el-table
        :data="state.tableData"
        :height="tableHeight"
        v-loading="state.loading"
        stripe
      >
        <template v-if="columns?.length !== 0">
          <template v-for="column of columns" :key="column.prop">
            <el-table-column v-if="column.type === 'index'" :="column">
            </el-table-column>
            <el-table-column v-else :="column">
              <template #default="{ row }">
                <textEllipsis :text="row[column.prop]" />
              </template>
            </el-table-column>
          </template>
        </template>
        <slot name="columns"></slot>
      </el-table>
    </div>
    <div class="table-page" v-if="pageVisible">
      <el-pagination
        v-model:current-page="state.currentPage"
        v-model:page-size="state.pageSize"
        :page-sizes="[10, 50, 100]"
        layout="total, prev, pager, next, sizes, jumper"
        :total="state.total"
        :small="false"
        @current-change="getData"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, type Component, watch, onMounted } from "vue";
import { useDomHight } from "@/shared/hooks";
import { TableColumnInstance } from "element-plus";
import textEllipsis from "./textEllipsis.vue";
interface State {
  currentPage: number;
  pageSize: number;
  total: number;
  tableData: any[];
  loading: boolean;
}

const state: State = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
  tableData: [],
  loading: false,
});

interface Props {
  columns?: (TableColumnInstance & { component: Component })[];
  pageVisible: boolean;
  mountedGetData: boolean;
  fetchData: (
    currentPage?: string | number,
    pageSize?: string | number
  ) =>
    | {
        total: number | string;
        list: any[];
      }
    | Promise<{
        total: number | string;
        list: any[];
      }>;
}

const props = withDefaults(defineProps<Props>(), {
  pageVisible: true,
  mountedGetData: true,
});

watch(
  () => state.pageSize,
  () => {
    getData();
  }
);

const tableRef = ref<HTMLDivElement | null>(null);
const tableHeight = useDomHight(tableRef as any);

onMounted(() => {
  if (props.mountedGetData) getData();
});

async function getData() {
  state.loading = true;
  fetchData().finally(() => (state.loading = false));
}

async function fetchData() {
  const { total, list } = await props.fetchData(
    state.currentPage,
    state.pageSize
  );

  [state.total, state.tableData] = [Number(total ?? 0), list];
}

defineExpose({
  refresh: getData,
});
</script>

<style lang="scss" scoped>
@use "@/styles/common";
.table-container {
  width: 100%;
  height: 100%;
  :deep {
    .el-scrollbar__view {
      width: 100%;
    }
  }
  @include common.flex(space-between, flex-end, column);
  .table-content {
    width: 100%;
    height: 0;
    flex-grow: 1;
  }
  .table-page {
    width: 100%;
    display: flex;
    flex-shrink: 0;
    justify-content: flex-end;
    margin-top: 8px;
  }
}
</style>
