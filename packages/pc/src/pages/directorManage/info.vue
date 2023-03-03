<template>
  <div class="director-manage-info-container">
    <el-form
      ref="formRef"
      :rules="state.rules"
      :model="state.formData"
      class="demo-form-inline"
      label-width="100"
    >
      <div class="form-item-container">
        <div class="form-item">
          <div class="form-item-text"><span class="red-star">*</span>姓名</div>
          <el-form-item prop="name">
            <el-input
              class="long-input"
              v-model="state.formData.name"
              placeholder="请输入姓名"
            />
          </el-form-item>
        </div>
      </div>
      <div class="form-item-container">
        <div class="form-item">
          <div class="form-item-text">
            <span class="red-star">*</span>手机号
          </div>
          <el-form-item prop="phone">
            <el-input
              class="long-input"
              v-model="state.formData.phone"
              placeholder="请输入手机号"
            />
          </el-form-item>
        </div>
      </div>
      <div class="form-item-container">
        <div class="form-item">
          <div class="form-item-text"><span class="red-star">*</span>角色</div>
          <el-form-item prop="role">
            <el-select
              class="long-input"
              v-model="state.formData.role"
              placeholder="请选择角色"
              :disabled="state.isEdit"
            >
              <el-option
                v-for="item in roleList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
      </div>
      <div class="form-item-container">
        <div class="form-item">
          <div class="form-item-text">
            <span class="red-star">*</span>负责区域
          </div>
          <el-form-item prop="country">
            <div class="long-input">
              <el-cascader
                :disabled="state.isEdit"
                :show-all-levels="false"
                :props="{
                  checkStrictly: true,
                }"
                v-model="state.formData.country"
                :options="countryOptions"
              />
            </div>
          </el-form-item>
        </div>
      </div>
      <div class="form-item-container" v-if="isShowEnabled">
        <div class="form-item">
          <div class="form-item-text"><span class="red-star">*</span>状态</div>
          <el-form-item prop="status">
            <el-select
              class="short-input"
              v-model="state.formData.status"
              placeholder="请选择状态"
            >
              <el-option
                v-for="item in state.statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div class="button-container">
      <el-button @click="cancel">取消</el-button>
      <el-button @click="submit" type="primary">提交</el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref, computed, onMounted } from "vue";
import { required, phone, areaCode } from "@/shared/validateRule";
import { type FormInstance, ElMessage } from "element-plus";
import { addAccount, getAccountInfoById } from "@/services/directorManage";
import { useRouter, useRoute } from "vue-router";
import {
  approverRole,
  Options,
  directorStatus as statusList,
} from "@/shared/dict/constant";
import { useCommonStore } from "@/store";
import { util } from "@/shared";
import { UserInfo } from "@/services/login";
import { isAdmin } from "@/services/permission";
import * as constant from "@/shared/dict/constant";

const router = useRouter();
const route = useRoute();
interface Item extends Options {
  children?: Options[];
}

interface State {
  isEdit: boolean;
  id: number;
  formData: {
    name: string;
    phone: string;
    country: string[] | string;
    role: number | string;
    status: number | string;
  };
  statusList: Item[];
  rules: {
    name: any[];
    phone: any[];
    status: any[];
    country: any[];
    role: any[];
  };
}

const state: State = reactive({
  isEdit: false,
  id: 0,
  formData: {
    name: "",
    phone: "",
    country: "",
    role: "",
    status: "",
  },
  statusList,
  rules: {
    name: [required],
    phone: [required, phone],
    status: [required],
    country: [required],
    role: [required],
  },
});

const userIdentity = util.getUserIdentity();
state.rules.country = [areaCode(userIdentity)];

const formRef = ref<FormInstance | null>(null);

const commonStore = useCommonStore();

const countryOptions = computed(() => {
  const userIdentity = util.getUserIdentity();
  let disabled = [1, 2];
  if (userIdentity === 4) disabled = [1, 2, 3];
  if (userIdentity === 5) disabled = [1, 2, 3, 4];
  if (isAdmin()) {
    disabled = [];
  }
  return util.formatRegion(commonStore.regions, disabled);
});

const userInfo = util.getUserInfo();
const roleList = computed(() => {
  let list: any[] = [];
  // 如果是区县负责人
  if (isAdmin()) {
    list = approverRole;
  } else if (userInfo.approverRole === 60) {
    list = constant.areaManager;
  } else if (userInfo.approverRole === 40) {
    list = constant.townManager;
  } else if (userInfo.approverRole === 20) {
    list = constant.villageManager;
  }
  return list;
});

const isShowEnabled = computed(() => {
  return constant.auditors
    .map((auditor) => auditor.value)
    .includes(state.formData.role);
});

function cancel() {
  router.back();
}

function submit() {
  formRef.value?.validate((valid) => {
    if (!valid) return;
    if (
      ([1, 10, 20].includes(state.formData.role) &&
        state.formData.country.length !== 5) ||
      ([30, 40].includes(state.formData.role) &&
        state.formData.country.length !== 4) ||
      ([50, 60].includes(state.formData.role) &&
        state.formData.country.length !== 3)
    ) {
      return ElMessage({
        message: "请正确设置角色以及负责区域",
        type: "warning",
      });
    }

    if (valid) {
      const params: Partial<UserInfo> = {
        townCode: state.formData.country[3],
        villageCode: state.formData.country[4],
        areaCode: state.formData.country[2],
        cityCode: state.formData.country[1],
        level: state.formData.country.length,
        provinceCode: state.formData.country[0],
        mobile: state.formData.phone,
        username: state.formData.name,
        approverRole: state.formData.role as number,
        status: 1,
      };

      if (isShowEnabled.value) {
        params.status = state.formData.status as number;
      }
      if (state.isEdit) {
        params.id = state.id;
      }
      addAccount(params).then(() => {
        ElMessage({
          message: "操作成功",
          type: "success",
        });
        cancel();
      });
    }
  });
}

onMounted(() => {
  if (route.query.id) {
    state.isEdit = true;
    getAccountInfoById({
      id: Number(route.query.id),
    }).then((res) => {
      state.id = res.id;
      state.formData.name = res.username;
      state.formData.phone = res.mobile;
      state.formData.status = res.status;
      state.formData.country = res ? util.getUserInfoDefaultAreas(res) : [];
      state.formData.role = res.approverRole;
    });
  }
});
</script>
<style lang="scss" scoped>
@use "@/styles/common";
@use "@/styles/index";
.director-manage-info-container {
  padding: 49px 0 16px 16px;
  width: 100%;
  height: 100%;
  @include common.flex(flex-start, center, column);
  .long-input {
    width: 435px;
  }

  .form-item-container {
    @include common.flex(flex-start);
    .form-item {
      @include common.flex(flex-start, flex-start);
      .form-item-text {
        margin-top: 8px;
        text-align: right;
        flex-shrink: 0;
        width: 100px;
        margin-right: 10px;
      }
      .red-star {
        color: red;
      }
    }
  }
  .short-input {
    width: 168px;
  }
  .button-container {
    margin-top: 40px;
  }
  ::v-deep {
    .el-cascader {
      width: 100%;
    }
    .el-form-item__content {
      margin-left: 0 !important;
    }
  }
}
</style>
