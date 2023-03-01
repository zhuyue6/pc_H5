<template>
  <div class="container">
    <div class="logo">
      <div class="icon logo-icon"></div>
      <h3 class="logo-title">集聚上楼申请管理云平台</h3>
    </div>
    <div class="user-container">
      <div class="icon">
        <userIcon class="user-icon" />
      </div>
      <div class="user-info">
        <span>{{ userInfo?.username }}</span>
        <span class="user-text">{{ userInfo?.areaChina }}</span>
      </div>
      <el-dropdown>
        <el-icon class="user-info-dropdown" color="#fff">
          <caret-bottom />
        </el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="doLoginOut">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CaretBottom } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import userIcon from "@/components/icons/user.vue";
import { loginOut } from "@/services/login";
import { util } from "@/shared";

const userInfo = util.getUserInfo();

const router = useRouter();
function doLoginOut() {
  loginOut().then(() => {
    router.push({
      path: "/login",
    });
  });
}
</script>

<style scoped lang="scss">
@use "@/styles/common";
@use "@/styles/index";
.container {
  width: 100%;
  height: 56px;
  border-bottom: 1px solid #dcdfe6;
  @include common.flex(space-between);
  background-color: index.$primaryColor;
  .icon {
    width: 32px;
    height: 32px;
    @include common.flex;
    border-radius: 16px;
    .user-icon {
      font-size: 32px;
      color: #fff;
    }
    &.logo-icon {
      background-color: #fff;
    }
  }
  .logo {
    height: 100%;
    @include common.flex;
    padding-left: 12px;
    .logo-title {
      height: 24px;
      font-size: index.$titleFontSize;
      margin-left: 8px;
      font-family: MicrosoftYaHei;
      color: #ffffff;
      line-height: 24px;
    }
  }
  .user-container {
    @include common.flex;
    padding-right: 16px;
    .user-info {
      @include common.flex(center, flex-start, column);
      margin-left: 8px;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: #ffffff;
      line-height: 20px;
      margin-right: 6px;
      .user-text {
        max-width: 106px;
        @include common.overflowEllipsis;
      }
    }
    .user-info-dropdown {
      cursor: pointer;
    }
  }
}
</style>
