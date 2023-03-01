<template>
  <div class="component-upload-image">
    <el-upload
      multiple
      :action="uploadImgUrl"
      list-type="picture-card"
      :on-success="handleUploadSuccess"
      :before-upload="handleBeforeUpload"
      :limit="limit"
      :on-error="handleUploadError"
      :on-exceed="handleExceed"
      ref="imageUpload"
      :before-remove="handleDelete"
      :show-file-list="true"
      :headers="headers"
      :data="headers"
      name="multipartFile"
      :file-list="fileList"
      :on-preview="handlePictureCardPreview"
      :disabled="disabled"
      :class="{ hide: fileList.length >= limit }"
    >
      <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
      <!-- 兼容pdf显示 -->
      <template #file="{ file }" v-if="fileType.includes('pdf')">
        <template v-if="file.status !== 'uploading'">
          <span v-if="isPdf(file?.url)" class="pdf-box">
            <el-icon><Document /></el-icon>
            <span class="pdf-name">{{ file?.name }}</span>
          </span>
          <img
            v-else
            class="el-upload-list__item-thumbnail"
            :src="file.url"
            alt=""
          />
          <span class="el-upload-list__item-actions">
            <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
            >
              <el-icon><zoom-in /></el-icon>
            </span>
            <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleDelete(file)"
            >
              <el-icon><Delete /></el-icon>
            </span>
          </span>
        </template>
        <!-- <el-progress
          v-if="file.status === 'uploading'"
          type="circle"
          stroke-width="6"
          :percentage="Number(file.percentage)"
        /> -->
      </template>
    </el-upload>
    <!-- 上传提示 -->
    <div class="el-upload__tip" v-if="showTip && !disabled">
      请上传
      <template v-if="fileSize">
        大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b>
      </template>
      <template v-if="fileType">
        格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b>
      </template>
      的文件
    </div>

    <el-dialog
      v-model="dialogVisible"
      title="预览"
      width="800px"
      @closed="closePreview"
      append-to-body
    >
      <iframe
        v-if="isPdf(dialogImageUrl)"
        :src="dialogImageUrl"
        type="application/x-google-chrome-pdf"
        width="100%"
        height="1000px"
      />
      <img
        v-else
        :src="dialogImageUrl"
        style="display: block; max-width: 100%; margin: 0 auto"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { Plus, Delete, ZoomIn, Document } from "@element-plus/icons-vue";

import { ref, watch, computed, defineEmits } from "vue";
import { getToken } from "@/services/login";
import { apiconfig } from "@/shared/http";

const props = defineProps({
  modelValue: [String, Object, Array],
  // 图片数量限制
  limit: {
    type: Number,
    default: 5,
  },
  // 大小限制(MB)
  fileSize: {
    type: Number,
    default: 5,
  },
  // 文件类型, 例如['png', 'jpg', 'jpeg']
  fileType: {
    type: Array,
    default: () => ["png", "jpg", "jpeg", "pdf"],
  },
  // 是否显示提示
  isShowTip: {
    type: Boolean,
    default: true,
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);
const number = ref(0);
const uploadList = ref([]);
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const fileBaseUrl = "";
const https = apiconfig.host.includes("http") ? "" : "https://";
const apiBaseUrl = https + apiconfig.host + apiconfig.apiPath;
const uploadImgUrl = ref(apiBaseUrl + "/upload"); // 上传的图片服务器地址
const headers = ref({ Authorization: getToken() });
const fileList = ref([]);
const showTip = computed(
  () => props.isShowTip && (props.fileType || props.fileSize)
);
const imageUploadRef = ref();

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      // 首先将值转为数组
      const list = Array.isArray(val) ? val : props.modelValue.split(",");
      // 然后将数组转为对象数组
      fileList.value = list.map((item) => {
        if (typeof item === "string") {
          item = { name: getExt(item, "/"), url: item, ext: getExt(item) };
        }
        return item;
      });
    } else {
      fileList.value = [];
      return [];
    }
  },
  { deep: true, immediate: true }
);

// 上传前loading加载
function handleBeforeUpload(file) {
  let isImg = false;
  if (props.fileType.length) {
    let fileExtension = "";
    if (file.name.lastIndexOf(".") > -1) {
      fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
    }
    isImg = props.fileType.some((type) => {
      if (file.type.indexOf(type) > -1) return true;
      if (fileExtension && fileExtension.indexOf(type) > -1) return true;
      return false;
    });
  } else {
    isImg = file.type.indexOf("image") > -1;
  }
  if (!isImg) {
    ElMessage.error(
      `文件格式不正确, 请上传${props.fileType.join("/")}图片格式文件!`
    );
    return false;
  }
  if (props.fileSize) {
    const isLt = file.size / 1024 / 1024 < props.fileSize;
    if (!isLt) {
      ElMessage.error(`上传图片大小不能超过 ${props.fileSize} MB!`);
      return false;
    }
  }
  // proxy.$modal.loading("正在上传图片，请稍候...");
  number.value++;
}

// 文件个数超出
function handleExceed() {
  ElMessage.error(`上传文件数量不能超过 ${props.limit} 个!`);
}

// 上传成功回调
function handleUploadSuccess(res, file) {
  // console.log(res, file);
  if (res.code === 0) {
    uploadList.value.push({ name: res.data.fileName, url: res.data.fileUrl });
    uploadedSuccessfully();
  } else {
    number.value--;
    // proxy.$modal.closeLoading();
    ElMessage.error(res.msg);
    imageUploadRef.value.handleDelete(file);
    uploadedSuccessfully();
  }
}

// 删除图片
function handleDelete(file) {
  const findex = fileList.value.map((f) => f.name).indexOf(file.name);
  if (findex > -1 && uploadList.value.length === number.value) {
    fileList.value.splice(findex, 1);
    emit("update:modelValue", listToString(fileList.value));
    return false;
  }
}

// 上传结束处理
function uploadedSuccessfully() {
  if (number.value > 0 && uploadList.value.length === number.value) {
    fileList.value = fileList.value
      .filter((f) => f.url !== undefined)
      .concat(uploadList.value);
    uploadList.value = [];
    number.value = 0;
    emit("update:modelValue", listToString(fileList.value));
    // proxy.$modal.closeLoading();
  }
}

// 上传失败
function handleUploadError() {
  ElMessage.error("上传图片失败");
  // proxy.$modal.closeLoading();
}

// 预览
function handlePictureCardPreview(file) {
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
}
function closePreview() {
  dialogImageUrl.value = "";
  dialogVisible.value = false;
}

// 对象转成指定字符串分隔
function listToString(list, separator) {
  let strs = "";
  separator = separator || ",";
  for (let i in list) {
    if (undefined !== list[i].url && list[i].url.indexOf("blob:") !== 0) {
      strs += list[i].url.replace(fileBaseUrl, "") + separator;
    }
  }
  return strs != "" ? strs.substr(0, strs.length - 1) : "";
}

function getExt(filename, tag = ".") {
  return filename.slice(((filename.lastIndexOf(tag) - 1) >>> 0) + 2);
}

function isPdf(filename) {
  // console.log("filename", filename);
  if (!filename) {
    return false;
  }
  const fileExt = getExt(filename);
  return ["pdf"].includes(fileExt);
}
</script>

<style scoped lang="scss">
@use "@/styles/common.scss";
// .el-upload--picture-card 控制加号部分
:deep(.hide .el-upload--picture-card) {
  display: none;
}
.pdf-box {
  width: 100%;
  height: 100%;
  padding: 0 10px;
  box-sizing: border-box;
  @include common.flex(center, center);
  .pdf-name {
    @include common.overflowEllipsis();
  }
}
</style>
