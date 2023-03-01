<template>
  <div class="login-container">
    <div class="login-content-bg"></div>
    <div class="login-content">
      <div class="login-content-title">集聚上楼申请管理云平台</div>
      <div class="input-content">
        <el-form :rules="rules" :model="state.formData" ref="formRef">
          <el-form-item prop="phone">
            <el-input
              v-model="state.formData.phone"
              placeholder="请输入手机号"
              size="large"
              :prefix-icon="Iphone"
            />
          </el-form-item>
          <el-form-item prop="password" v-if="state.type === 'pwd'">
            <el-input
              size="large"
              v-model="state.formData.password"
              placeholder="请输入密码"
              :prefix-icon="verificate"
            />
          </el-form-item>
          <div class="input-content-item" v-else>
            <div class="verification-code-input">
              <el-form-item prop="verificationCode">
                <el-input
                  size="large"
                  v-model="state.formData.verificationCode"
                  placeholder="请输入验证码"
                  :prefix-icon="verificate"
                />
              </el-form-item>
            </div>
            <el-button
              :disabled="state.countDown !== 0"
              class="verification-code-button"
              size="large"
              @click="verificationCode"
              >{{ verificationCodeText }}</el-button
            >
          </div>
        </el-form>
      </div>
      <el-button
        class="submit-button"
        type="primary"
        size="large"
        @click="submit"
        >登录</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { Iphone } from "@element-plus/icons-vue";
import { reactive, computed, ref } from "vue";
import { loginSms, loginPwd, getVerificationCode } from "@/services/login";
import { ElMessage, FormInstance } from "element-plus";
import verificate from "@/components/icons/verificate.vue";
import * as validateRule from "@/shared/validateRule";
import { useRouter } from "vue-router";

interface State {
  formData: {
    phone: string;
    password: string;
    verificationCode: string;
  };
  type: string;
  countDown: number;
}

const state: State = reactive({
  formData: {
    phone: "",
    password: "",
    verificationCode: "",
  },
  type: "pwd",
  countDown: 0,
});

const rules = {
  phone: [validateRule.required, validateRule.phone],
  password: [validateRule.required],
  verificationCode: [validateRule.required, validateRule.verificationCode],
};

const formRef = ref<FormInstance | null>(null);

const verificationCodeText = computed<null | string | number>(() => {
  return state.countDown === 0 ? "获取验证码" : `${state.countDown}秒`;
});

function verificationCode() {
  getVerificationCode({
    mobile: state.formData.phone,
    sendScene: "LOGIN",
  });
  if (state.countDown !== 0) {
    return ElMessage({
      message: "验证码60秒只能获取一次，请稍后再试。",
      type: "warning",
    });
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

const router = useRouter();
function submit() {
  formRef.value?.validate((isValid) => {
    if (isValid) {
      if (state.type === "pwd") {
        loginPwd({
          mobile: state.formData.phone,
          password: state.formData.password,
        }).then(() =>
          router.push({
            path: "/home",
          })
        );
      } else {
        loginSms({
          mobile: state.formData.phone,
          smsCode: state.formData.verificationCode,
        }).then(() =>
          router.push({
            path: "/home",
          })
        );
      }
    }
  });
}
</script>

<style lang="scss">
@use "@/styles/common";
.login-container {
  width: 100%;
  height: 100%;
  @include common.flex;
  background: common.backgroundFill("@/static/images/bgs/login.png");
  .login-content-bg {
    width: 784px;
    height: 559px;
    background: common.backgroundFill("@/static/images/bgs/login_left.png");
  }
  .login-content {
    width: 456px;
    height: 565px;
    padding: 40px;
    background-color: #ffffff;
    box-shadow: 6px 6px 6px 0px rgba(0, 0, 0, 0.16);
    border-radius: 8px;
    @include common.flex(flex-start, center, column);
    .login-content-title {
      font-size: 26px;
      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
      font-weight: bold;
      color: #333333;
      text-shadow: 6px 6px 6px rgba(0, 0, 0, 0.16);
    }
    .input-content {
      width: 320px;
      margin: 93px 0 24px 0;
      .input-content-item {
        @include common.flex(space-between, flex-start);
        margin-top: 24px;
        .verification-code-input {
          width: 200px;
        }
        .verification-code-button {
          width: 110px;
        }
      }
    }
    .submit-button {
      width: 320px;
    }
  }
}
</style>
