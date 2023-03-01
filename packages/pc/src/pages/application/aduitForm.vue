<template>
  <div>
    <el-form
      class="aduit-form"
      label-width="140px"
      v-model="formData"
      :rules="rules"
    >
      <el-form-item label="审核结果：" prop="status">
        <el-select v-model="formData.status" placeholder="请选择审核结果">
          <el-option
            v-for="item in aduitType"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审核意见：" prop="remark">
        <el-input v-model="formData.remark" rows="4" type="textarea"></el-input>
      </el-form-item>
      <div class="footer">
        <el-button type="primary" @click="submitAduit">提交</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";
import { aduitType } from "@/shared/dict/constant";

interface Aduit {
  status: number | string;
  remark: string;
}
const formData: Aduit = reactive({
  status: "",
  remark: "",
});

const rules = reactive({
  status: [{ required: true, message: "请选择审核结果", trigger: "blur" }],
  remark: [
    { required: false, message: "退回时必须输入审核建议。", trigger: "blur" },
  ],
});
watch(
  () => formData.status,
  (status) => {
    rules.remark[0].required = status == 0;
  }
);

// 提交审批
const submitAduit = () => {
  console.log("提交审批");
};
</script>

<style scoped lang="scss">
.aduit-form {
  width: 600px;
  :deep(.el-select) {
    width: 100%;
  }
  .footer {
    text-align: center;
    margin-top: 32px;
  }
}
</style>
