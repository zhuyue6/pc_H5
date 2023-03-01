import { defineStore } from "pinia";
import { UserInfo } from "@/services/login";

export const useUserStore = defineStore("user", {
  state: () => ({
    info: undefined,
    token: undefined,
  }),
  actions: {
    setInfo(info: UserInfo) {
      this.info = info as any;
    },
    setToken(token: string) {
      this.token = token as any;
    },
  },
});
