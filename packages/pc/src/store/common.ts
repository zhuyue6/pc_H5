import { defineStore } from "pinia";
import { getRegions } from "@/services/common";

export const useCommonStore = defineStore("common", {
  state: () => ({
    regions: [],
  }),
  actions: {
    getRegions() {
      return getRegions().then((res) => {
        this.regions = res as any;
      });
    },
  },
});
