import { type UserInfo } from "@/services/login";

export function setStorage(key: string, value: any): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getStorage(key: string): any {
  let data = null;
  try {
    data = JSON.parse(localStorage.getItem(key) as string);
  } catch {
    data = null;
  }
  return data;
}

export function getUserInfo(): UserInfo {
  return getStorage("userInfo") ?? {};
}

export function getToken() {
  return getStorage("token") ?? "";
}
