import { get } from "@/shared/http";

export interface Region {
  id: string | number; // id
  level: number; // 级别: 1省|2市|3区县|4街道/乡镇|5村
  pid: string | number; // 父级行政区域编码
  regionCode: string; // 行政区域编码
  regionName: string; // 行政区域编码名称
  childRegion?: Region[];
}

export function getRegions() {
  return get<Region[]>("/api/region/child");
}
