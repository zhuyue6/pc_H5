import { defineStore } from "pinia";

export const useCommonStore = defineStore("common", {
  state: () => ({
    navTitle: "农民集聚审核公示",
  }),
  actions: {
    setNavTitle(title: string) {
      this.navTitle = title;
    },
  },
});
