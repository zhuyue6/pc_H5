<template>
  <div class="login-container">
    <div class="login-content">
      <pageContainer>
        <van-form ref="formRef">
          <div class="input-item">
            <van-field
              v-model="state.formData.IDNumber"
              label="身份证号"
              placeholder="请输入身份证号码"
              :rules="[validateRule.required, validateRule.id]"
            />
          </div>
          <div class="input-item">
            <van-field
              v-model="state.formData.phone"
              label="手机号"
              placeholder="请输入手机号码"
              :rules="[validateRule.required, validateRule.phone]"
            />
          </div>
          <div class="input-item">
            <van-field
              v-model="state.formData.verificationCode"
              maxlength="6"
              label="验证码"
              placeholder="请输入验证码"
              :rules="[validateRule.required, validateRule.verificationCode]"
            />
            <van-button
              type="primary"
              :disabled="state.countDown !== 0"
              @click="verificationCode"
              >{{ verificationCodeText }}</van-button
            >
          </div>
        </van-form>
      </pageContainer>
    </div>
    <van-button class="submit-button" block type="primary" @click="submit">
      查询
    </van-button>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from "vue";
import * as validateRule from "@/shared/validateRule";
import { login, getVerificationCode } from "@/services/login";
import pageContainer from "@/components/pageContainer/index.vue";
import { showToast } from "vant";

interface State {
  countDown: number;
  formData: {
    IDNumber: string;
    phone: string;
    verificationCode: string;
  };
}
const state: State = reactive({
  countDown: 0,
  formData: {
    IDNumber: "",
    phone: "",
    verificationCode: "",
  },
});

const verificationCodeText = computed<null | string | number>(() => {
  return state.countDown === 0 ? "获取验证码" : `${state.countDown}秒`;
});

const formRef = ref(null);

function submit() {
  const result = formRef.value?.validate().then(() => {
    login();
  });
}

function verificationCode() {
  getVerificationCode();
  if (state.countDown !== 0) {
    return showToast("验证码60秒只能获取一次，请稍后再试。");
  }
  state.countDown = 60;
  countDown();
}

function countDown() {
  if (state.countDown === 0) return;
  setTimeout(() => {
    state.countDown--;
    countDown();
  }, 1000);
}
</script>

<style lang="scss" scoped>
@use "@/styles/common";
.login-container {
  width: 100%;
  height: 100%;
  @include common.flex(flex-start, center, column);
  ::v-deep {
    //   .van-field {
    //     display: flex;
    //     align-items: center;
    //     justify-content: space-between;
    //   }
    .van-field__label {
      width: 64px;
      margin-right: 20px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      line-height: normal;
      color: #333333;
    }
    //   .van-field__error-message {
    //   }
    //   .van-field__value {
    //     font-family: PingFangSC-Regular, PingFang SC;
    //     font-weight: 400;
    //     margin-right: 0;
    //     color: #bebebe;
    //   }
    .van-button {
      min-width: 102px;
      height: 36px;
      padding: 0;
    }
    //   .van-cell {
    //     padding: 0;
    //     line-height: normal;
    //     border: none;
    //   }
    //   .van-cell::after {
    //     border: none;
    //   }
    //   .van-button__content {
    //     width: 100%;
    //   }
    //   .van-button__text {
    //     font-size: 28rpx;
    //     font-family: PingFangSC-Regular, PingFang SC;
    //     font-weight: 400;
    //   }
  }
  .login-content {
    background-color: #fff;
    width: 100%;
    padding: 0 16px;
    .input-item {
      @include common.flex;
      border-bottom: 1px solid #e0e0e0;
      &:last-child {
        border: none;
      }
    }
  }
  .submit-button {
    margin-top: 68px;
    max-width: 90%;
    width: 343px;
    height: 48px;
    background: #1890ff;
    border-radius: 48px;
  }
}
</style>
