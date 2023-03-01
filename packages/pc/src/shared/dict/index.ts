import type { Options } from "./constant";

/**
 * 根据字典获取label
 * @param dict
 * @param value
 * @returns label
 */
export function searchDictByValue(dict: Options[], value: any) {
  if (value == null && value == "") {
    return null;
  }
  try {
    for (let i = 0; i < dict.length; i++) {
      if (dict[i].value == value) {
        return dict[i].label;
      }
    }
  } catch (e) {
    return null;
  }
}
