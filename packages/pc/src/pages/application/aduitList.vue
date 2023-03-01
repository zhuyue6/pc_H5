<template>
  <div class="aduit-list-container">
    <div class="header">
      <div class="header-info">
        <div class="base-info">
          <div class="info-item title">审核表</div>
          <div class="info-item">退回编号：<span>111111111111</span></div>
          <div class="info-item">申请编号：<span>111111111111</span></div>
          <div class="success">
            <span>2023-02-15 11:06:33</span>
            <span>审核通过</span>
            <span class="icon">已通过</span>
          </div>
        </div>
      </div>
      <el-button type="primary" @click="openEditRecord"
        >查看全部审核记录</el-button
      >
    </div>
    <div class="aduit-list">
      <template v-for="(item, index) in 3" :key="index">
        <div class="aduit-item">
          <div class="area-name active"><i class="dot"></i>村委-审核意见</div>
          <div class="sub-info">
            <p class="leader-name">张三</p>
            <p class="time">2023.2.22 11:22:00</p>
            <p class="status">
              审核结果：<span class="status-text success">通过</span>
            </p>
          </div>
        </div>
        <div class="aduit-line"></div>
      </template>
      <div class="aduit-item">
        <div class="area-name active"><i class="dot"></i>完成</div>
      </div>
    </div>
  </div>
  <editRecordDrawer ref="editRecordRef" />
</template>

<script setup lang="ts">
import editRecordDrawer from "./components/editRecordDrawer.vue";
import { ref } from "vue";
let editRecordRef = ref<null | InstanceType<typeof editRecordDrawer>>(null);

interface Props {
  orderData?: object;
}
const props = defineProps<Props>();

const openEditRecord = () => {
  editRecordRef.value?.openDrawer("xxx");
};
</script>

<style scoped lang="scss">
@use "@/styles/common.scss";
.aduit-list-container {
  .header {
    @include common.flex(space-between, center);
    color: #333;
    line-height: 22px;
    border-bottom: 1px solid #e8e8e8;
    padding-bottom: 14px;
    .header-info {
      .base-info {
        @include common.flex(flex-start, center);
        > .info-item {
          margin-right: 20px;
          font-size: 14px;
          > span {
            color: rgba(102, 102, 102, 0.65);
          }
        }
        .title {
          font-size: 16px;
          line-height: 30px;
          font-weight: bold;
        }
        .success {
          > span {
            margin-right: 8px;
          }
          .icon {
            display: inline-block;
            color: #fff;
            background-color: #30b346;
            border-radius: 2px;
            width: 44px;
            height: 18px;
            line-height: 18px;
            text-align: center;
          }
        }
      }
    }
  }
  .aduit-list {
    margin-top: 28px;
    margin-bottom: 30px;
    color: #999;
    font-size: 14px;
    line-height: 22px;
    @include common.flex(flex-start, flex-start);
    .aduit-item {
      .area-name {
        font-size: 16px;
        @include common.flex(flex-start, center);
        &.active {
          color: #333;
        }
        .dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #1890ff;
          margin-right: 8px;
        }
      }
      .sub-info {
        padding-left: 16px;
        > p {
          margin: 4px 0;
        }
        .status-text {
          &.success {
            color: #30b346;
          }
          &.error {
            color: #ff1f33;
          }
        }
      }
    }
    .aduit-line {
      width: 200px;
      height: 2px;
      margin-top: 10px;
      margin-right: 10px;
      background: #1890ff;
    }
  }
}
</style>
