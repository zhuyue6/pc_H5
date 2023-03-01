<template>
  <div class="price-form">
    <div class="price-item" v-for="(item, index) in priceData" :key="index">
      <p class="price-name">{{ item.title }}</p>
      <div class="table-box" :class="item.list.length > 1 ? '' : 'single'">
        <div
          class="table-item"
          v-for="(subItem, index) in item.list"
          :key="index"
        >
          <div class="label">{{ subItem.label }}</div>
          <div class="info-value">{{ subItem.value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { getValueTable } from "@/services/apply";
interface Props {
  id: string;
}
const props = defineProps<Props>();
const id = ref(props.id);
console.log("id", id, id.value);

const priceData = reactive([
  {
    title: "房子价值",
    list: [
      { label: "结构", value: "xxxxxx" },
      { label: "建筑面积(㎡)", value: "xxxxxx" },
      { label: "成新率(%)", value: "xxxxxx" },
      { label: "单价(元/㎡)", value: "xxxxxx" },
      { label: "价值(元)", value: "xxxxxx" },
    ],
  },
  {
    title: "宅基地将价值",
    list: [
      { label: "建筑占地(㎡)", value: "xxxxxx" },
      { label: "所属片区", value: "xxxxxx" },
      { label: "片区单价(元/㎡)", value: "xxxxxx" },
    ],
  },
  {
    title: "宅基地资格权价值",
    list: [
      { label: "退出人数(人)", value: "xxxxxx" },
      { label: "退出宅基地资格权面积(㎡)", value: "xxxxxx" },
      { label: "单价(元/㎡)", value: "xxxxxx" },
      { label: "价值(元)", value: "xxxxxx" },
    ],
  },
  {
    title: "搬迁奖励—xxxxx农村集体经济组织成员(非整村)",
    list: [
      { label: "退出人数(人)", value: "xxxxxx" },
      { label: "搬迁奖励(元/人)", value: "xxxxxx" },
      { label: "价值(元)", value: "xxxxxx" },
    ],
  },
  {
    title: "购房奖励——xxxx村集体经济组织成员",
    list: [
      { label: "退出人数(人)", value: "xxxxxx" },
      { label: "资格权面积(㎡)", value: "xxxxxx" },
      { label: "安置方式", value: "xxxxxx" },
      { label: "房子单价(元/㎡)", value: "xxxxxx" },
      { label: "价值(元)", value: "xxxxxx" },
    ],
  },
  {
    title: "综合核算价值",
    list: [{ label: "总计(元)", value: "xxxxxx" }],
  },
]);

const initData = () => {
  getValueTable({ approvalApplyId: id.value }).then((res) => {
    console.log("getValueTable", res);
  });
};
if (id.value) {
  initData();
}
</script>

<style scoped lang="scss">
@use "@/styles/common.scss";
.price-form {
  .price-item {
    .price-name {
      font-size: 16px;
      font-weight: 600;
      color: #333333;
      line-height: 22px;
    }
    .table-box {
      display: grid;
      grid-template-columns: 50% 50%;
      &.single {
        grid-template-columns: 100%;
      }
      .table-item {
        border: 1px solid #e8e8e8;
        margin-top: -1px;
        @include common.flex(flex-start, center);
        .label {
          width: 200px;
          height: 44px;
          line-height: 44px;
          text-align: right;
          padding-right: 16px;
          background: #f4f6f9;
          border-right: 1px solid #e8e8e8;
        }
        .info-value {
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: #333333;
          line-height: 22px;
          flex: 1;
          padding-left: 16px;
        }
      }
    }
  }
}
</style>
