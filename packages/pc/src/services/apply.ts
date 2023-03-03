import { get, post } from "@/shared/http";

// 户内成员
export interface Member {
  name: string;
  idNumber: string;
  job: string;
  phone: string;
  relation: string;
  exitEligibilityArea: string;
}
// 搬迁人员相关情况
export interface RelocationMember {
  lowIncomeMember: Array<string>;
  relocationMember: string;
  relocationStandard: string;
  wholeVillage: string;
}
export interface HouseInfo {
  frame: string; // 结构
  coveredArea: string; // 建筑面积
  exitArea: string; // 拟退出宅基地-建筑占地(㎡)
  newnessRate: string; // 成新率
  placementMethod: string; // 安置方式
}

export interface ApplyData {
  id?: string;
  status?: string; // 状态 10待提交、20审核中、30已通过、40已驳回）
  name: string;
  idNo: string;
  mobile: string;
  address: string;
  extend: {
    relationArea: string; // 所属搬迁片区
    memberList: Member[]; // 户内成员
    exitEligibilityArea: string | number; // 退出宅基地资格权面积(㎡)
    applyTableList: string; // 申请表
    censusRegisterList: string; // 户籍资料
    houseProveList: string; // 户内农村房屋权属证明
    housePicList: string; // 房屋实地照片
    housingReform: string; // 工作及房改情况
    other: string;
    relocationMember: RelocationMember;
  };
  // 申请人基本情况表，提交时结构需要拆解
  houseInfo: HouseInfo[];
}

export interface ApprovalBase {
  approvalApplyId: string | number;
}

interface AduitList extends ApprovalBase {
  type: string | number; // 1 查询全部 , 2 查询最新 ，3 查询 驳回的
}
// 审核
export interface AduitData extends ApprovalBase {
  reason?: string;
  status: number | string;
}

interface QueryList {
  keyword: string;
  page: number;
  pageSize: number;
}

export interface QueryListItem {
  address: string; // 申请人地址
  coveredArea: number; // 建筑面积(㎡)
  exitArea: number; // 拟退出在基地-建筑占地(㎡)
  id: number | string; // 主键
  mobile: string; // 申请人手机号
  name: string; // 申请人姓名
  placementMethod: string; // 安置方式
  status: string; // 状态 10待提交、20审核中、30已通过、40已驳回）
}

interface QueryResponse {
  result: QueryListItem[];
  total: number;
}

// 新增申请表
export function addApply(data: ApplyData) {
  return post("approval/apply/add", data);
}

// 编辑申请表
export function editApply(data: ApplyData) {
  return post("approval/apply/edit", data);
}
//  编辑记录
export function getApprovalApplyEditList(data: ApprovalBase) {
  return get("approval/apply/getApprovalApplyEditList", data);
}
// 审批
export function auditApply(data: AduitData) {
  return post("approval/apply/audit", data);
}

// 查看审核信息(状态、原因)
export function getUserAduitStatus(data: ApprovalBase) {
  return get("approval/apply/getApprovalApplyDetailInfo", data);
}

// 村务员 提交审核表
export function submitApply(data: ApprovalBase) {
  return post("approval/apply/submit", data);
}

// 审核员、负责人， 申请中、已通过、已驳回列表
export function applyList(data: QueryList) {
  return post<QueryResponse>("approval/apply/getApprovalApplyList", data);
}

// 审核表详情
export function getApprovalApply(data) {
  return get<ApplyData>("approval/apply/getApprovalApply", data);
}

// 村委员查看申请列表
export function queryApprovalApplyList(data: QueryList) {
  return post<QueryResponse>("approval/apply/queryApprovalApplyList", data);
}

// 审核记录列表
export function queryAuditRecord(data: AduitList) {
  return post("approval/apply/queryAuditRecord", data);
}

// 获取价值核算表
export function getValueTable(data: ApprovalBase) {
  return get("approval/apply/getValueTable", data);
}

// 导出数据
export function exportApplyList(data) {
  return post("approval/apply/export", data);
}
