<template>
  <div class="form-container">
    <div class="form-box" :class="type">
      <div class="part-title">申请人户内情况</div>
      <el-form
        :model="formData"
        :rules="rules"
        label-position="right"
        :label-width="isEdit ? '160px' : 'auto'"
        :inline="isEdit ? false : 'inline'"
        ref="baseFormRef"
      >
        <div class="base-info">
          <el-form-item label="申请人姓名：" prop="name">
            <el-input
              v-if="isEdit"
              placeholder="请输入姓名"
              v-model="formData.name"
              maxlength="20"
            />
            <span class="info-text" v-else>{{ formData.name }}</span>
          </el-form-item>
          <el-form-item label="申请人身份证号码：" prop="idNo">
            <el-input
              v-if="isEdit"
              placeholder="请输入身份证号码"
              v-model="formData.idNo"
              maxlength="18"
            />
            <span class="info-text" v-else>{{ formData.idNo }}</span>
          </el-form-item>
          <el-form-item label="申请人手机号：" prop="mobile">
            <el-input
              v-if="isEdit"
              placeholder="请输入手机号"
              v-model="formData.mobile"
              maxlength="11"
            />
            <span class="info-text" v-else>{{ formData.mobile }}</span>
          </el-form-item>
          <el-form-item label="申请人地址：" prop="address">
            <el-input
              v-if="isEdit"
              placeholder="请输入"
              v-model="formData.address"
              maxlength="200"
            />
            <span class="info-text" v-else>{{ formData.address }}</span>
          </el-form-item>
          <el-form-item label="所属搬迁片区：" prop="extend.relationArea">
            <el-select v-if="isEdit" v-model="formData.extend.relationArea">
              <el-option
                v-for="item in dict.relationAreaDict"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
            <span class="info-text" v-else>{{
              formData.extend.relationArea
            }}</span>
          </el-form-item>
        </div>
        <div class="part-title">户内成员</div>
        <el-form-item prop="memberList" class="no-label">
          <el-table :data="formData.extend.memberList" style="width: 100%">
            <el-table-column prop="name">
              <template #header>
                <span class="label-required">姓名</span>
              </template>
              <template #default="scope">
                <el-input
                  type="text"
                  v-model="scope.row.name"
                  maxlength="20"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="idNumber">
              <template #header>
                <span class="label-required">身份证号码</span>
              </template>
              <template #default="scope">
                <el-input
                  type="text"
                  v-model="scope.row.idNumber"
                  maxlength="18"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="phone" label="手机号码">
              <template #default="scope">
                <el-input
                  type="text"
                  v-model="scope.row.phone"
                  maxlength="11"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="relation">
              <template #header>
                <span class="label-required">与户主关系</span>
              </template>
              <template #default="scope">
                <el-select v-model="scope.row.relation">
                  <el-option
                    v-for="item in dict.relation"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="job">
              <template #header>
                <span class="label-required">职务</span>
              </template>
              <template #default="scope">
                <el-select v-model="scope.row.job">
                  <el-option
                    v-for="item in dict.jobDict"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="exitEligibilityArea">
              <template #header>
                <span class="label-required">退出宅基地资格权面积(m²)</span>
              </template>
              <template #default="scope">
                <el-select v-model="scope.row.exitEligibilityArea">
                  <el-option
                    v-for="item in [0, 20]"
                    :key="item"
                    :value="item"
                    :label="item"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="op" label="操作" v-if="isEdit">
              <template #default="scope">
                <el-button
                  type="danger"
                  text
                  size="small"
                  @click="delMember(scope.$index)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-button
          v-if="isEdit"
          @click="addMember"
          type="primary"
          text
          :icon="CirclePlus"
        >
          新增一行</el-button
        >
        <div class="part-title">申请人基本情况</div>
        <el-form-item prop="houseInfo" class="no-label">
          <el-table :data="formData.houseInfo" style="width: 100%">
            <el-table-column label="拟退房房屋" align="center">
              <el-table-column
                prop="frame"
                label="结构"
                width="160"
                align="center"
              >
                <template #default="scope">
                  <el-select v-if="isEdit" v-model="scope.row.frame">
                    <el-option
                      v-for="item in dict.houseStructure"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"
                    ></el-option>
                  </el-select>
                  <span v-else>{{
                    searchDictByValue(dict.houseStructure, scope.row.frame)
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="coveredArea"
                label="建筑面积(m²)"
                width="160"
                align="center"
              >
                <template #default="scope">
                  <el-input
                    v-if="isEdit"
                    type="text"
                    v-model="scope.row.coveredArea"
                  ></el-input>
                  <span v-else>{{ scope.row.coveredArea }}</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column
              prop="exitArea"
              label="拟退出宅基地-建筑占地(㎡)"
              align="center"
            >
              <template #default="scope">
                <el-input
                  v-if="isEdit"
                  type="text"
                  v-model="scope.row.exitArea"
                ></el-input>
                <span v-else>{{ scope.row.exitArea }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="newnessRate"
              label="成新率(%)"
              align="center"
            >
              <template #default="scope">
                <!-- <el-input
                  v-if="isEdit"
                  type="text"
                  v-model="scope.row.newnessRate"
                ></el-input> -->
                <span>{{
                  searchDictByValue(dict.houseStructureRate, scope.row.frame)
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="集聚安置方式" align="center">
              <template #default="scope">
                <el-select v-model="scope.row.placementMethod" v-if="isEdit">
                  <el-option
                    v-for="item in dict.placementMode"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  ></el-option>
                </el-select>
                <span v-else>{{
                  searchDictByValue(
                    dict.placementMode,
                    scope.row.placementMethod
                  )
                }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <div class="part-title">搬迁人员相关情况</div>
        <div class="base-info">
          <el-form-item
            label="整村搬迁："
            prop="extend.relocationMember.wholeVillage"
          >
            <el-radio-group
              :disabled="!isEdit"
              v-model="formData.extend.relocationMember.wholeVillage"
              @change="changeRelocation"
            >
              <el-radio
                v-for="item in dict.trueFalseDict"
                :key="item.value"
                :label="item.value"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="true"
            label="人员情况："
            prop="extend.relocationMember.relocationMember"
          >
            <el-select
              v-if="isEdit"
              v-model="formData.extend.relocationMember.relocationMember"
            >
              <template
                v-if="formData.extend.relocationMember.wholeVillage == '是'"
              >
                <!-- 整村搬迁=是 -->
                <el-option
                  v-for="item in dict.personLevel2"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </template>
              <template v-else>
                <!-- 整村搬迁=否 -->
                <el-option
                  v-for="item in dict.personLevel1"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </template>
            </el-select>
            <span v-else>
              {{
                searchDictByValue(
                  formData.extend.relocationMember.wholeVillage == "是"
                    ? dict.personLevel2
                    : dict.personLevel1,
                  formData.extend.relocationMember.wholeVillage
                )
              }}
            </span>
          </el-form-item>
          <el-form-item
            v-if="
              formData.extend.relocationMember.wholeVillage == '是' &&
              formData.extend.relocationMember.relocationMember == '低收入农户'
            "
            label="低收入对象："
            prop="extend.relocationMember.lowIncomeMember"
          >
            <div
              v-if="formData.extend.memberList.length == 0"
              class="empty-hint"
            >
              请输入户内成员信息
            </div>
            <el-checkbox-group
              v-else
              :disabled="!isEdit"
              v-model="formData.extend.relocationMember.lowIncomeMember"
            >
              <el-checkbox
                v-for="(item, index) in formData.extend.memberList"
                :key="index"
                :label="item.name"
              />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item
            v-if="
              formData.extend.relocationMember.wholeVillage == '是' &&
              ['一般农户', '低收入农户'].includes(
                formData.extend.relocationMember.relocationMember
              )
            "
            label="省定异地整村搬迁标准："
            prop="extend.relocationMember.relocationStandard"
          >
            <el-radio-group
              :disabled="!isEdit"
              v-model="formData.extend.relocationMember.relocationStandard"
            >
              <el-radio
                v-for="item in dict.trueFalseDict"
                :key="item.value"
                :label="item.value"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </div>

        <div class="part-title">
          资料凭证<span class="hint">（点击图片可放大）</span>
        </div>
        <div class="picture-box">
          <el-form-item
            label="常山县农民集聚申请表："
            prop="extend.applyTableList"
            label-width="180px"
          >
            <ImageUpload
              :disabled="!isEdit"
              v-model:model-value="formData.extend.applyTableList"
              :is-show-tip="false"
            />
          </el-form-item>
          <el-form-item
            label="户籍资料："
            prop="extend.censusRegisterList"
            label-width="180px"
          >
            <ImageUpload
              :disabled="!isEdit"
              v-model:model-value="formData.extend.censusRegisterList"
              :is-show-tip="false"
            />
          </el-form-item>
          <el-form-item
            label="户内农村房屋权属证明："
            prop="extend.houseProveList"
            label-width="180px"
          >
            <ImageUpload
              :disabled="!isEdit"
              v-model:model-value="formData.extend.houseProveList"
              :is-show-tip="false"
            />
          </el-form-item>
          <el-form-item
            label="房屋实地照片："
            prop="extend.housePicList"
            label-width="180px"
          >
            <ImageUpload
              :disabled="!isEdit"
              v-model:model-value="formData.extend.housePicList"
              :is-show-tip="false"
            />
          </el-form-item>
          <el-form-item
            label="工作及房改情况："
            prop="extend.housingReform"
            label-width="180px"
          >
            <ImageUpload
              :disabled="!isEdit"
              v-model:model-value="formData.extend.housingReform"
              :is-show-tip="false"
            />
          </el-form-item>
          <el-form-item
            label="其他(非必填)："
            prop="extend.other"
            label-width="180px"
          >
            <ImageUpload
              :disabled="!isEdit"
              v-model:model-value="formData.extend.other"
              :is-show-tip="false"
            />
          </el-form-item>
        </div>
      </el-form>
      <div class="footer" v-if="isEdit">
        <el-button type="default" plain @click="goBack"
          >取消编辑返回列表</el-button
        >
        <el-button type="primary" @click="handleSubmit(false)">保存</el-button>
        <el-button type="primary" @click="handleSubmit(true)"
          >保存并返回列表</el-button
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as validateRule from "@/shared/validateRule";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { ImageUpload } from "@/components";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { CirclePlus } from "@element-plus/icons-vue";
import { searchDictByValue } from "@/shared/dict";
import * as dict from "@/shared/dict/constant";
import { addApply, editApply, getApprovalApply } from "@/services/apply";
import {
  // Member,
  // RelocationMember,
  // HouseInfo,
  ApplyData,
} from "@/services/apply";
import { getRegion } from "@/services/common";
import { getSuffix } from "@/shared/util";
import { useUserStore } from "@/store/user";

interface Props {
  type: string;
  id?: string;
}
const router = useRouter();
const props = defineProps<Props>();
const isEdit = props.type == "edit";
const id = ref(props.id || "");
const rules = reactive<FormRules>({
  name: [{ required: true, message: "请输入申请人姓名", trigger: "blur" }],
  idNo: [
    { required: true, message: "请输入申请人身份证号码", trigger: "blur" },
    { ...validateRule.checkIDCardRule, trigger: "blur" },
  ],
  mobile: [
    { required: true, message: "申请人手机号", trigger: "blur" },
    { ...validateRule.phone, trigger: "blur" },
  ],
  address: [{ required: true, message: "请输入申请人地址", trigger: "blur" }],
  memberList: [
    {
      required: true,
      validator: (rule, value, callback) => {
        console.log(formData.extend.memberList);
        try {
          if (formData.extend.memberList.length == 0) {
            throw new Error("请录入户内成员信息");
          }
          formData.extend.memberList.map((item) => {
            if (!item.name) {
              throw new Error("姓名不能为空");
            }
            if (!item.idNumber) {
              throw new Error("身份证号码不能为空");
            }
            if (item.idNumber && !validateRule.checkIDCard(item.idNumber)) {
              throw new Error("请输入正确的身份证号码");
            }
            if (item.phone && !validateRule.phoneReg.test(item.phone)) {
              throw new Error("请输入正确手机号");
            }
            if (!item.relation) {
              throw new Error("请选择与户主关系");
            }
            if (item.exitEligibilityArea === "") {
              throw new Error("请输入退出宅基地资格权面积");
            }
          });
          callback && callback();
        } catch (error) {
          callback && callback((error as Error).message);
        }
      },
    },
  ],
  houseInfo: [
    {
      required: true,
      validator: (rule, value, callback) => {
        console.log(formData.houseInfo);
        try {
          formData.houseInfo.map((item) => {
            if (!item.frame) {
              throw new Error("请选择结构");
            }
            if (item.coveredArea === "") {
              throw new Error("请输入建筑面积");
            }
            if (item.exitArea === "") {
              throw new Error("请输入拟退出宅基地-建筑占地");
            }
            if (!item.placementMethod) {
              throw new Error("请选择集聚安置方式");
            }
          });
          callback && callback();
        } catch (error) {
          callback && callback((error as Error).message);
        }
      },
    },
  ],
  extend: <FormRules>{
    relationArea: [
      { required: true, message: "请选择所属搬迁片区", trigger: "change" },
    ],
    applyTableList: [
      {
        required: true,
        message: "请上传常山县农民集聚申请表",
        trigger: "change",
      },
    ],
    censusRegisterList: [
      { required: true, message: "请上传户籍资料", trigger: "change" },
    ],
    houseProveList: [
      {
        required: true,
        message: "请上传户内农村房屋权属证明",
        trigger: "change",
      },
    ],
    housePicList: [
      { required: true, message: "请上传房屋实地照片", trigger: "change" },
    ],
    housingReform: [
      { required: true, message: "请上传工作及房改情况", trigger: "change" },
    ],
    relocationMember: <FormRules>{
      wholeVillage: [
        { required: true, message: "请选择是否整村搬迁", trigger: "blur" },
      ],
      relocationMember: [
        { required: true, message: "请选择人员情况", trigger: "blur" },
      ],
      relocationStandard: [
        {
          required: true,
          message: "请选择省定异地整村搬迁标准",
          trigger: "blur",
        },
      ],
      lowIncomeMember: [
        { required: true, message: "请选择低收入对象", trigger: "blur" },
      ],
    },
  },
});
// 基本信息
const baseFormRef = ref<FormInstance>();

let isDoing = ref<boolean>(false);

// "https://cs-jvgl-img.zjsszxc.com/file/248091655994900480.pdf"
// "https://cs-jvgl-img.zjsszxc.com/file/248811332593287168.jpeg,https://cs-jvgl-img.zjsszxc.com/file/248812288777158656.jpg"

const formData = reactive<ApplyData>({
  // countryCode: "", // 操作人村code
  // townCode: "", // 操作人乡镇code
  // districtCode: "", // 操作人区县code
  // approverRole: "", // 审批人角色
  id: "",
  status: "", // 状态 10待提交、20审核中、30已通过、40已驳回）
  name: "",
  idNo: "",
  mobile: "",
  address: "",
  extend: {
    relationArea: "", // 所属搬迁片区
    memberList: [], // 户内成员
    exitEligibilityArea: 0, // 退出宅基地资格权面积(㎡)
    applyTableList: "", // 申请表
    censusRegisterList: "", // 户籍资料
    houseProveList: "", // 户内农村房屋权属证明
    housePicList: "", // 房屋实地照片
    housingReform: "", // 工作及房改情况
    other: "",
    relocationMember: {
      lowIncomeMember: [],
      relocationMember: "",
      relocationStandard: "", // 省定异地整村搬迁标准
      wholeVillage: "",
    },
  },
  // 申请人基本情况表，提交时结构需要拆解
  houseInfo: [
    {
      frame: "", // 结构
      coveredArea: "", // 建筑面积
      exitArea: "", // 拟退出宅基地-建筑占地(㎡)
      newnessRate: "", // 成新率
      placementMethod: "", // 安置方式
    },
  ],
});

const initData = () => {
  getApprovalApply({
    approvalApplyId: formData.id,
  }).then((data) => {
    console.log(data);
    Object.keys(formData).map((key) => {
      console.log(key);
      formData[key] = data[key];
    });
    [
      "applyTableList",
      "censusRegisterList",
      "houseProveList",
      "housePicList",
      "housingReform",
      "other",
    ].map((key) => {
      formData.extend[key] = data.extend[key].map((item) => item.url).join(",");
    });
    formData.extend;
    formData.houseInfo = [
      {
        frame: data.extend.frame, // 结构
        coveredArea: data.extend.coveredArea, // 建筑面积
        exitArea: data.extend.exitArea, // 拟退出宅基地-建筑占地(㎡)
        newnessRate: data.extend.newnessRate, // 成新率
        placementMethod: data.extend.placementMethod, // 安置方式
      },
    ];
  });
};

if (id.value) {
  formData.id = id.value;
  initData();
}

// getRegion()

const addMember = () => {
  formData.extend.memberList.push({
    name: "",
    idNumber: "",
    job: "",
    phone: "",
    relation: "",
    exitEligibilityArea: "",
  });
};
const delMember = (index: number) => {
  formData.extend.memberList.splice(index, 1);
};

const changeRelocation = () => {
  formData.extend.relocationMember.relocationMember = "";
  formData.extend.relocationMember.lowIncomeMember = [];
  formData.extend.relocationMember.relocationStandard = "";
};

const goBack = () => {
  router.go(-1);
};
const userStore = useUserStore();

const handleSubmit = async (needBack = false) => {
  if (isDoing.value) {
    return;
  }
  isDoing.value = true;
  try {
    let valid = await baseFormRef.value?.validate();
    console.log(valid);
    if (valid) {
      let reqData = JSON.parse(JSON.stringify(formData));
      [
        "applyTableList",
        "censusRegisterList",
        "houseProveList",
        "housePicList",
        "housingReform",
        "other",
      ].map((key) => {
        reqData.extend[key] = reqData.extend[key]
          .split(",")
          .map((item: string) => getFileObj(item));
      });
      reqData.extend.frame = formData.houseInfo[0].frame;
      reqData.extend.coveredArea = formData.houseInfo[0].coveredArea;
      reqData.extend.exitArea = formData.houseInfo[0].exitArea;
      reqData.extend.newnessRate = searchDictByValue(
        dict.houseStructureRate,
        formData.houseInfo[0].frame
      );
      reqData.extend.placementMethod = formData.houseInfo[0].placementMethod;
      // reqData.countryCode = userStore.info
      // reqData.townCode = userStore.info.townCode
      // reqData.districtCode = userStore.info
      // reqData.approverRole = userStore.info?.approverRole
      delete reqData.houseInfo;
      if (formData.id) {
        editApply(reqData)
          .then(() => {
            ElMessage({
              type: "success",
              message: "修改成功",
            });
            needBack && goBack();
          })
          .finally(() => {
            isDoing.value = false;
          });
      } else {
        addApply(reqData)
          .then((res) => {
            console.log(res);
            if (res) {
              formData.id = String(res);
              initData();
            }
            ElMessage({
              type: "success",
              message: "新增成功",
            });
            needBack && goBack();
          })
          .finally(() => {
            isDoing.value = false;
          });
      }
    } else {
      isDoing.value = false;
      ElMessage({
        type: "error",
        message: "请输入完整申请表信息",
      });
    }
  } catch (error) {
    console.log(error);
    ElMessage({
      type: "error",
      message: "请输入完整申请表信息",
    });
  }
};

const getFileObj = (url: string) => {
  return {
    name: getSuffix(url, "/"),
    suffix: getSuffix(url),
    url,
  };
};
// console.log(searchDictByValue(relation, 1))
</script>

<style scoped lang="scss">
.form-container {
  .form-box {
    .part-title {
      font-size: 14px;
      margin-top: 30px;
      padding-bottom: 25px;
      font-weight: bold;
      .hint {
        color: #999999;
        font-weight: 500;
      }
    }
    .base-info {
      :deep(.el-form-item__label) {
        font-weight: 400;
        font-size: 12px;
      }
      :deep(.el-select) {
        width: 100%;
      }
      .empty-hint {
        color: #999;
        font-size: 12px;
      }
      .info-text {
        color: #333;
        font-size: 14px;
        margin-right: 40px;
      }
    }
    :deep(.no-label) {
      width: 100%;
      .el-form-item__content {
        margin-left: 0 !important;
      }
    }
    &.edit {
      color: #333333;
      line-height: 20px;
      > h2 {
        font-size: 16px;
      }
      .part-title,
      :deep(.label-required) {
        &::before {
          content: "*";
          color: #ff1f33;
          margin-right: 2px;
        }
      }
      .base-info {
        max-width: 600px;
      }
    }
    &.view {
      .part-title {
        color: #1890ff;
        font-weight: bold;
      }
      .base-info {
        :deep(.el-form-item__label-wrap) {
          margin-left: 0 !important;
        }
      }
    }
    .picture-box {
      :deep(.el-form-item__label) {
        font-weight: 400;
        font-size: 14px;
        color: rgba($color: #000000, $alpha: 0.85);
      }
    }
    .footer {
      padding-left: 180px;
      margin-top: 50px;
      > .el-button {
        margin-right: 30px;
      }
    }
  }
}
</style>
