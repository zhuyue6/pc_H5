import { util } from "@/shared";

export function isDirector(): boolean {
  const userInfo = util.getUserInfo();
  return [20, 40, 60].includes(userInfo?.approverRole);
}

export function isAdmin(): boolean {
  const userInfo = util.getUserInfo();
  return userInfo?.isAdmin === 1;
}

export function getPermission() {
  // 管理员1 负责人2
  const list = [];
  if (isAdmin()) list.push(1);
  if (isDirector()) list.push(1);
  return list;
}
