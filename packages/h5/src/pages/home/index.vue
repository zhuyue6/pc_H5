<template>
  <div class="home-container">
    <div class="info-container pass">
      <pageContainer>
        <div class="title">农户申报详情</div>
        <div class="info-content-container">
          <div class="info-content">
            <div class="info-content-item">审核状态：审核中</div>
            <div class="info-content-item">申请编号：3198489191</div>
            <div class="info-content-item">申请人员：张雨绮</div>
            <div class="info-content-item">身份证号：339928737464662100</div>
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
              :active="1"
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
const themeVars = {
  stepIconSize: "18px",
};
</script>

<style lang="scss" scoped>
@use "@/styles/common";
.home-container {
  width: 100%;
  height: 100%;
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
      padding: 6px 10px 50rpx 0;
    }
  }
}
</style>
