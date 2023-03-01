<template>
  <div class="director-manage-info-container">
    <el-form
      ref="formRef"
      :rules="state.rules"
      :model="state.formData"
      class="demo-form-inline"
      label-width="100"
    >
      <el-form-item label="姓名" prop="name">
        <el-input
          class="long-input"
          v-model="state.formData.name"
          placeholder="请输入姓名"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          class="long-input"
          v-model="state.formData.phone"
          placeholder="请输入手机号"
        />
      </el-form-item>
      <el-form-item label="角色" prop="role">
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
      <el-form-item label="负责区域" prop="country">
        <el-cascader
          :disabled="state.isEdit"
          :show-all-levels="false"
          :props="{
            checkStrictly: true,
          }"
          v-model="state.formData.country"
          :options="countryOptions"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
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
    country: string[];
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
    country: [],
    role: "",
    status: "",
  },
  statusList,
  rules: {
    name: [required],
    phone: [required, phone],
    status: [required],
    country: [],
    role: [required],
  },
});

const userIdentity = util.getUserIdentity();
state.rules.country = [areaCode(userIdentity)];

const formRef = ref<FormInstance | null>(null);

const commonStore = useCommonStore();

const countryOptions = computed(() => {
  const userIdentity = util.getUserIdentity();
  let disabled = [1, 2, 3];
  if (userIdentity === 4) disabled = [1, 2, 3];
  if (userIdentity === 5) disabled = [1, 2, 3, 4];
  return util.formatRegion(commonStore.regions, disabled);
});

const userInfo = util.getUserInfo();
const roleList = computed(() => {
  return approverRole.filter((item) => {
    return item.value < userInfo.approverRole;
  });
});

function cancel() {
  router.back();
}

function submit() {
  formRef.value?.validate((valid) => {
    if (
      util.isUserDisabled(state.formData.role as number) &&
      state.formData.status === 0
    ) {
      return ElMessage({
        message: "村务员和各级负责人无法禁用",
        type: "warning",
      });
    }
    if (valid) {
      const params: Partial<UserInfo> = {
        townCode: state.formData.country[3],
        villageCode: state.formData.country[4],
        areaCode: state.formData.country[2],
        cityCode: state.formData.country[1],
        provinceCode: state.formData.country[0],
        mobile: state.formData.phone,
        username: state.formData.name,
        approverRole: state.formData.role as number,
        status: state.formData.status as number,
      };
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
  }
}
</style>
