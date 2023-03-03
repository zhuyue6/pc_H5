import { Region } from "@/services/common";
import { type UserInfo } from "@/services/login";
import { approverRole } from "@/shared/dict/constant";

interface UrlQuerys {
  [index: string]: any;
}

export function getUrlQuerys(): UrlQuerys | null {
  let query: UrlQuerys | null = null;
  const queryArray = window.location.search
    .substring(1)
    .split("&")
    .filter((item) => item !== "");
  if (queryArray.length > 0) {
    const reg = /(\S*)=(\S*)/;
    query = {};
    for (const queryItem of queryArray) {
      const r = queryItem.match(reg);
      if (r != null) {
        query[r[1]] = decodeURI(r[2]);
      }
    }
  }
  return query;
}

export function getUrlQuery(name: string): string | null {
  const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  const r = window.location.search.substring(1).match(reg);
  if (r != null) {
    return decodeURI(r[2]);
  }
  return null;
}

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

// 日期格式化
export function parseTime(time: any, pattern?: string): string | null {
  if (arguments.length === 0 || !time) {
    return null;
  }
  const format = pattern || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string" && /^[0-9]+$/.test(time)) {
      time = parseInt(time);
    } else if (typeof time === "string") {
      time = time
        .replace(new RegExp(/-/gm), "/")
        .replace("T", " ")
        .replace(new RegExp(/\.[\d]{3}/gm), "");
    }
    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value];
    }
    if (result.length > 0 && value < 10) {
      value = "0" + value;
    }
    return value || 0;
  });
  return time_str;
}

// 获取文件后缀
export function getSuffix(filename: string, tag = ".") {
  return filename.slice(((filename.lastIndexOf(tag) - 1) >>> 0) + 2);
}

const throttleSet = new Set();
export function throttle(fn: () => void, time = 200) {
  if (throttleSet.has(fn)) return;
  setTimeout(() => {
    fn();
    throttleSet.delete(fn);
  }, time);
}

export function simpleDeepCopy(data: any) {
  return JSON.parse(JSON.stringify(data));
}

export interface FormatRegion {
  id: string | number; // id
  level: number; // 级别: 1省|2市|3区县|4街道/乡镇|5村
  pid: string | number; // 父级行政区域编码
  label: string; // 行政区域编码
  value: string; // 行政区域编码名称
  disabled?: boolean;
  children?: FormatRegion[];
}

export function formatRegion(
  regions: Region[],
  disabled: number[] = []
): FormatRegion[] {
  const data: FormatRegion[] = [];
  for (const region of regions ?? []) {
    const regionItem: FormatRegion = {
      id: region.id,
      label: region.regionName,
      value: region.regionCode,
      pid: region.pid,
      level: region.level,
    };
    if (disabled.includes(region.level)) regionItem.disabled = true;
    data.push(regionItem);

    if (Array.isArray(region.childRegion)) {
      regionItem.children = formatRegion(region.childRegion, disabled);
    }
  }
  return data;
}

export function getAreasInfo(
  selecteds: string[],
  formatRegions: FormatRegion[]
): FormatRegion[] {
  // 通过value找区域详情，目前最多是省到村5级
  const list: FormatRegion[] = [];
  let formatRegionsSelected = formatRegions;
  for (const selected of selecteds) {
    const findItem = formatRegionsSelected.find(
      (formatRegionItem) => formatRegionItem.value === selected
    );
    if (findItem) {
      list.push(findItem);
      formatRegionsSelected = findItem.children as FormatRegion[];
    }
  }
  return list;
}

export function getUserInfoAreasText(userInfo: UserInfo): string {
  let text = "";
  if (userInfo?.level <= 3) {
    text = userInfo.areaChina;
  } else if (userInfo?.level === 4) {
    text = userInfo.townChina;
  } else if (userInfo?.level === 5) {
    text = userInfo.villageChina;
  }
  return text;
}

export function getUserIdentity(): number {
  // 1省|2市|3区县|4街道/乡镇|5村
  const userInfo = getUserInfo();
  return userInfo.level;
}

export function getUserInfoDefaultAreas(info?: UserInfo): string[] {
  const list: string[] = [];
  let userInfo = info as UserInfo;
  let userIdentity = info?.level;
  if (!info) {
    userInfo = getUserInfo();
    userIdentity = getUserIdentity();
  }

  list[0] = userInfo.provinceCode;
  list[1] = userInfo.cityCode;
  list[2] = userInfo.areaCode;
  if (userIdentity === 4) {
    list[3] = userInfo.townCode;
  }
  if (userIdentity === 5) {
    list[3] = userInfo.townCode;
    list[4] = userInfo.villageCode;
  }
  return list;
}

export function roleTextByApproverRole(roleNumber: number) {
  const data = approverRole.find((item) => item.value === roleNumber);
  return data?.label;
}

export function isUserDisabled(role: number) {
  // 村务员和负责人无法禁用
  return [1, 20, 40, 60].includes(role);
}

export function getUserInfo(): UserInfo {
  return getStorage("userInfo") ?? {};
}

export function getToken() {
  return getStorage("token") ?? "";
}
