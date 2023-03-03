<template>
  <div class="home-container">
    <div :class="['info-container', stateClass]">
      <pageContainer>
        <div class="title">农户申报详情</div>
        <div class="info-content-container">
          <div class="info-content">
            <div class="info-content-item">审核状态：{{ stateText }}</div>
            <div class="info-content-item">申请编号：{{ state.id }}</div>
            <div class="info-content-item">申请人员：{{ state.name }}</div>
            <div class="info-content-item">身份证号：{{ state.cardId }}</div>
          </div>
          <div class="info-content-icon"></div>
        </div>
      </pageContainer>
    </div>
    <div class="home-steps-container">
      <pageContainer>
        <div class="home-steps-title">当前进度</div>
      </pageContainer>
      <div class="home-steps-content">
        <pageContainer>
          <van-config-provider :theme-vars="themeVars">
            <van-steps
              direction="vertical"
              :active="state.processStatus"
              finish-icon="checked"
              inactive-icon="circle"
              active-icon="more"
            >
              <van-step>
                <span class="process">村审核</span>
              </van-step>
              <van-step>
                <span class="process">乡镇审核</span>
              </van-step>
              <van-step>
                <span class="process">县级审核</span>
              </van-step>
              <van-step>
                <span class="process">完成</span>
              </van-step>
            </van-steps>
          </van-config-provider>
        </pageContainer>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import pageContainer from "@/components/pageContainer/index.vue";
import { onMounted, reactive, computed } from "vue";
import { getApprovalProcess } from "@/services/home";
const themeVars = {
  stepIconSize: "18px",
};

interface State {
  id: number | string;
  cardId: number | string;
  name: string;
  reason: string;
  processStatus: number;
  status: number;
}

const state: State = reactive({
  id: "",
  cardId: "",
  name: "",
  reason: "",
  processStatus: 0,
  status: 20, // 20审核中 30已通过 40已驳回
});

onMounted(() => {
  getApprovalProcess().then((res) => {
    state.id = res.id;
    state.cardId = res.idNo;
    state.name = res.name;
    state.processStatus = res.processStatus;
    state.status = res.status;
  });
});

const stateText = computed(() => {
  let text = "审核中";
  if (state.status === 30) {
    text = "已通过";
  } else if (state.status === 40) {
    text = "已驳回";
  }
  return text;
});

const stateClass = computed(() => {
  let classText = "verify";
  if (state.status === 30) {
    classText = "pass";
  } else if (state.status === 40) {
    classText = "back";
  }
  return classText;
});
</script>

<style lang="scss" scoped>
@use "@/styles/common";
.home-container {
  width: 100%;
  @include common.flex(center, center, column);

  .info-container {
    width: 100%;
    padding: 16px;
    background-color: #fff;
    &.pass {
      background: linear-gradient(
        90deg,
        rgba(47, 181, 125, 0.12) 0%,
        rgba(47, 181, 125, 0) 100%
      );
      .info-content-icon {
        background: common.backgroundFill("@/static/images/icons/pass.png");
      }
    }
    &.back {
      background: linear-gradient(
        90deg,
        rgba(237, 164, 62, 0.12) 0%,
        rgba(237, 164, 62, 0) 100%
      );
      .info-content-icon {
        background: common.backgroundFill("@/static/images/icons/back.png");
      }
    }
    &.verify {
      background-image: linear-gradient(
        90deg,
        rgba(24, 144, 255, 0.12) 0%,
        rgba(24, 144, 255, 0) 100%
      );
      .info-content-icon {
        background: common.backgroundFill("@/static/images/icons/verify.png");
      }
    }

    .title {
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 22px;
    }
    .info-content-container {
      display: flex;
      justify-content: space-between;
      padding-top: 12px;
      .info-content {
        .info-content-item {
          :last-child {
            margin-bottom: 0;
          }
          font-size: 14px;
          margin-bottom: 8px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #666666;
          line-height: 20px;
        }
      }
      .info-content-icon {
        flex-shrink: 0;
        border-radius: 38px;
        width: 66px;
        height: 66px;
      }
    }
  }
  .home-steps-container {
    width: 100%;
    height: 100%;
    .home-steps-title {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      margin: 16px 0 12px 16px;
    }
    .process {
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 22px;
    }
    .home-steps-content {
      background-color: #fff;
      padding: 8px;
      width: 100%;
      height: 100%;
    }
  }
  ::v-deep {
    .van-step__icon {
      background-color: #fff;
    }
    .van-hairline::after {
      border: none;
    }
    .van-step--vertical {
      padding: 6px 10px 50px 0;
    }
  }
}
</style>
