import { get, post } from "@/shared/http";
import { util } from "@/shared";
interface LoginParams {
  mobile?: string;
  password?: string;
  smsCode?: string;
}

export interface UserInfo {
  approverRole: number; // 审批人角色: 1村务员 10村审核员，20村负责人，30乡镇审核员，40乡镇负责人，50区县审核员，60区县负责人
  areaCode: string; // 区县code
  id: number; // 主键
  isAdmin: number; // 是否管理员
  level: number; // 级别: 1省|2市|3区县|4街道/乡镇|5村
  mobile: string; // 用户手机号(唯一)
  password: string; // 用户密码
  status: number; // 0禁用 1启用
  townCode: string; // 乡镇code
  provinceCode: string; // 省code
  cityCode: string; // 市code
  villageCode: string; // 村code
  userId: number; // 用户id
  username: string; // 用户姓名
  villageChina: string; // 村负责人
  townChina: string; // 乡镇负责人
  areaChina: string; //区县中文名
  zjdAccount: number; // 浙政钉账号
}

interface LoginResponse {
  accountInfo: UserInfo;
  token: string;
}

interface VerificationCodeParams {
  mobile: string;
  sendScene: string;
}

type VerificationCodeResponse = string;

export function getVerificationCode(params: VerificationCodeParams) {
  return get<VerificationCodeResponse>("sms_code", params);
}

export async function loginSms(params: LoginParams) {
  const loginData = await post<LoginResponse>("login_sms", params);
  const userInfo = loginData?.accountInfo;
  const token = loginData?.token;
  util.setStorage("userInfo", userInfo);
  util.setStorage("token", token);
}

export async function loginPwd(params: LoginParams) {
  const loginData = await post<LoginResponse>("login_pwd", params);
  const userInfo = loginData?.accountInfo;
  const token = loginData?.token;
  util.setStorage("userInfo", userInfo);
  util.setStorage("token", token);
}

export async function loginOut() {
  await post("login_out");
  util.setStorage("userInfo", "");
  util.setStorage("token", "");
}

export { getUserInfo, getToken } from "@/shared/util";
