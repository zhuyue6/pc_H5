import { useCommonStore } from "@/store";

const commonStore = useCommonStore();
/***
 * 进入一次性获取的数据信息
 */
export async function requests() {
  await commonStore.getRegions();
}
