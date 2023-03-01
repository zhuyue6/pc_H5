export interface Options {
  label: string;
  value: string | number | boolean;
}

// 是否选项下拉
export const trueFalseDict: Options[] = [
  { label: "是", value: "是" },
  { label: "否", value: "否" },
];

// 审批人角色
export const roleDict: Options[] = [
  { label: "村审核员", value: "10" },
  { label: "村负责人", value: "20" },
  { label: "乡镇审核员", value: "30" },
  { label: "乡镇负责人", value: "40" },
  { label: "区县审核员", value: "50" },
  { label: "区县负责人", value: "60" },
];

// 申请表状态
export const applyStatusDict: Options[] = [
  { label: "待提交", value: "10" },
  { label: "审核中", value: "20" },
  { label: "已通过", value: "30" },
  { label: "已驳回", value: "40" },
];

export const relationAreaDict: Options[] = [
  { label: "片区一", value: "片区一" },
  { label: "片区二", value: "片区二" },
  { label: "片区三", value: "片区三" },
];

// 与户主关系
export const relation: Options[] = [
  { label: "本人", value: "本人" },
  { label: "配偶", value: "配偶" },
  { label: "子女", value: "子女" },
  { label: "父母", value: "父母" },
  { label: "孙子孙女", value: "孙子孙女" },
  { label: "兄弟", value: "兄弟" },
  { label: "姐妹", value: "姐妹" },
  { label: "祖父母", value: "祖父母" },
  { label: "外祖父母", value: "外祖父母" },
];

// 职务
export const jobDict: Options[] = [
  { label: "务农", value: "务农" },
  { label: "务工", value: "务工" },
  { label: "自由职业", value: "自由职业" },
  { label: "机关事业单位在职在编", value: "机关事业单位在职在编" },
  { label: "国有企业在职在编", value: "国有企业在职在编" },
  { label: "学生", value: "学生" },
  { label: "现役军人", value: "现役军人" },
  { label: "现役军官", value: "现役军官" },
  { label: "服刑人员", value: "服刑人员" },
];

// 房屋结构
export const houseStructure: Options[] = [
  { label: "框混结构一等", value: "框混结构一等" },
  { label: "框混结构二等", value: "框混结构二等" },
  { label: "砖混结构一等", value: "砖混结构一等" },
  { label: "砖混结构二等", value: "砖混结构二等" },
  { label: "砖木结构一等", value: "砖木结构一等" },
  { label: "砖木结构二等", value: "砖木结构二等" },
  { label: "泥木及其他结构", value: "泥木及其他结构" },
];
// 成新率
export const houseStructureRate: Options[] = [
  { label: "95", value: "框混结构一等" },
  { label: "95", value: "框混结构二等" },
  { label: "90", value: "砖混结构一等" },
  { label: "90", value: "砖混结构二等" },
  { label: "85", value: "砖木结构一等" },
  { label: "85", value: "砖木结构二等" },
  { label: "80", value: "泥木及其他结构" },
];

// 集聚安置方式
export const placementMode: Options[] = [
  { label: "购买新建商品住宅", value: "购买新建商品住宅" },
  { label: "购买存量商品住宅", value: "购买存量商品住宅" },
  { label: "租赁村集体公寓", value: "租赁村集体公寓" },
];

// 不是整村搬迁 -人员情况
export const personLevel1: Options[] = [
  { label: "农村集体经济组织成员", value: "农村集体经济组织成员" },
  { label: "建档立卡低收入对象", value: "建档立卡低收入对象" },
  { label: "权利人", value: "权利人" },
];
// 整村搬迁 -人员情况
export const personLevel2: Options[] = [
  { label: "一般农户", value: "一般农户" },
  { label: "低收入农户", value: "低收入农户" },
  { label: "权利人", value: "权利人" },
];

// 编辑类型
export const editType: Options[] = [
  { label: "新增", value: "1" },
  { label: "编辑", value: "2" },
  { label: "提交", value: "3" },
];

export const aduitType: Options[] = [
  { label: "待我审", value: "10" },
  { label: "通过", value: "20" },
  { label: "驳回", value: "30" },
];

export const approverRole: Options[] = [
  { label: "村务员", value: 1 },
  { label: "村审核员", value: 10 },
  { label: "村负责人", value: 20 },
  { label: "乡镇审核员", value: 30 },
  { label: "乡镇负责人", value: 40 },
  { label: "区县审核员", value: 50 },
  { label: "区县负责人", value: 60 },
];

export const directorStatus: Options[] = [
  {
    label: "启动",
    value: 1,
  },
  {
    label: "禁用",
    value: 0,
  },
];
