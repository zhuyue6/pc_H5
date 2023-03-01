import { post } from "@/shared/http";

export interface dataResponse {
  applyNum: number; // 提交申请数
  areaName: string; // 区域名称，村｜乡镇｜
  countryAuditingNum: number; // 村级审核中
  districtAuditingNum: number; // 区县审核中
  passedNum: number; // 已通过数
  returnAuditingNum: number; // 退回修改中
  townAuditingNum: number; // 乡镇审核中
}

export function getDataList() {
  return post<dataResponse[]>("data/list");
}

export function getDataboard() {
  return post<dataResponse>("data/databoard");
}
