import { post, get } from "@/shared/http";
import { type UserInfo } from "@/services/login";
interface AccountParams {
  currentPage: number; // 当前页数
  pageSize: number; // 每页大小
  areaCode?: string; // 区县code
  mobile?: string; // 用户手机号(唯一)
  status?: string | number; // 状态：''全部|0禁用|1启用
  townCode?: string; // 乡镇code
  username?: string; // 用户姓名
  villageCode?: string; // 村code
  provinceCode?: string; // 省code
  cityCode?: string; // 市code
}

export interface AccountResponse {
  countId: string;
  current: number;
  hitCount: boolean;
  maxLimit: number;
  optimizeCountSql: boolean;
  orders: { asc: boolean; column: string }[];
  pages: number;
  records: UserInfo[];
  searchCount: boolean;
  size: number;
  total: number;
}

export function getAccountList(params: AccountParams) {
  return post<AccountResponse>("account/page", params);
}

interface AccountStatusParams {
  id: number | string;
  status: number | string;
}

export function setAccountStatus(params: AccountStatusParams) {
  return post("account/operate_status", params);
}

export function addAccount(params: Partial<UserInfo>) {
  return post("account/add", params);
}

interface AccountInfoParams {
  id?: number;
}

export function getAccountInfoById(params: AccountInfoParams) {
  return get<UserInfo>("account/info", params);
}
