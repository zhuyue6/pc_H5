<template>
  <div class="data-home-container">
    <div class="title">常山县</div>
    <div class="card-list-cotainer" v-if="isDirector()">
      <div
        :class="['card-item', item.type]"
        v-for="item of state.databoard"
        :key="item.name"
      >
        <span class="card-item-title">{{ item.name }}</span>
        <span class="card-item-number">{{ item.number }}</span>
      </div>
    </div>
    <div class="data-home-table">
      <div class="data-home-table-content">
        <cTable :columns="columns" :fetch-data="fetchData" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, onMounted } from "vue";
import { cTable } from "@/components";
import { getDataboard, dataResponse, getDataList } from "@/services/dataHome";
import { isDirector } from "@/services/permission";
interface State {
  databoard: {
    type: string;
    name: string;
    number: number;
  }[];
  list: dataResponse[];
}

const state: State = reactive({
  databoard: [
    {
      type: "submit",
      name: "提交申请数",
      number: 0,
    },
    {
      type: "village",
      name: "村级审核中",
      number: 0,
    },
    {
      type: "country",
      name: "乡级审核中",
      number: 0,
    },
    {
      type: "county",
      name: "县级审核中",
      number: 0,
    },
    {
      type: "reject",
      name: "驳回修改中",
      number: 0,
    },
    {
      type: "pass",
      name: "已通过",
      number: 0,
    },
  ],
  list: [],
});

const columns = [
  {
    type: "index",
    label: "排序",
    width: 100,
  },
  {
    prop: "areaName",
    label: "区域名称",
  },
  {
    prop: "applyNum",
    sortable: true,
    label: "申请提交数",
  },
  {
    prop: "countryAuditingNum",
    sortable: true,
    label: "村级审核中",
  },
  {
    prop: "townAuditingNum",
    sortable: true,
    label: "乡镇级审核中",
  },
  {
    prop: "districtAuditingNum",
    sortable: true,
    label: "县级审核中",
  },
  {
    prop: "returnAuditingNum",
    sortable: true,
    label: "驳回修改中",
  },
  {
    prop: "passedNum",
    sortable: true,
    label: "已通过",
  },
];

function setDataboard(data: dataResponse) {
  state.databoard[0].number = data.applyNum;
  state.databoard[1].number = data.countryAuditingNum;
  state.databoard[2].number = data.townAuditingNum;
  state.databoard[3].number = data.districtAuditingNum;
  state.databoard[4].number = data.returnAuditingNum;
  state.databoard[5].number = data.passedNum;
}

async function fetchData() {
  const list = await getDataList();
  return {
    list,
  };
}

onMounted(() => {
  getDataboard().then(setDataboard);
});
</script>
<style lang="scss" scoped>
@use "@/styles/common";
.data-home-container {
  padding: 16px 0 16px 16px;
  width: 100%;
  height: 100%;
  @include common.flex(center, center, column);
  .title {
    width: 100%;
    font-size: 16px;
    font-family: MicrosoftYaHeiSemibold;
    color: #333333;
    line-height: 21px;
  }
  .card-list-cotainer {
    width: 100%;
    margin-top: 4px;
    @include common.flex(flex-start, flex-start);
    flex-wrap: wrap;
    .card-item {
      padding: 24px;
      width: 275px;
      height: 125px;
      @include common.flex(flex-start, flex-start, column);
      background-size: 100% 100%;
      margin: 16px 16px 0 0;
      .card-item-title {
        width: 80px;
        height: 21px;
        font-size: 16px;
        font-family: MicrosoftYaHei;
        color: #4d5ca7;
        line-height: 21px;
      }
      .card-item-number {
        margin-top: 8px;
        line-height: 50px;
        font-size: 36px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #4d588b;
      }
      &.submit {
        background-image: url(@/static/images/bgs/data_home_submit.png);
      }
      &.village {
        background-image: url(@/static/images/bgs/data_home_village.png);
      }
      &.country {
        background-image: url(@/static/images/bgs/data_home_country.png);
      }
      &.county {
        background-image: url(@/static/images/bgs/data_home_county.png);
      }
      &.reject {
        background-image: url(@/static/images/bgs/data_home_reject.png);
      }
      &.pass {
        background-image: url(@/static/images/bgs/data_home_pass.png);
      }
    }
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
