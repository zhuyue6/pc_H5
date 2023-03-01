import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
  type NavigationGuardNext,
} from "vue-router";
import type { Component } from "vue";
import { getPermission } from "@/services/permission";
import { DataLine, Collection } from "@element-plus/icons-vue";
interface RouteMenu {
  title?: string;
  icon?: Component;
  key?: string | number;
  isNavigator?: boolean;
  children?: (RouteRecordRaw & RouteMenu)[];
}

export type IRouter = RouteRecordRaw & RouteMenu;
const routes: IRouter[] = [
  {
    path: "/home",
    name: "home",
    component: import("./pages/home/index.vue"),
    children: [
      {
        path: "",
        title: "数据首页",
        name: "dataHome",
        isNavigator: true,
        component: import("./pages/dataHome/index.vue"),
      },
      {
        path: "applicationList",
        title: "数据列表",
        isNavigator: true,
        component: import("./pages/application/listIndex.vue"),
        children: [
          {
            title: "全部",
            isNavigator: true,
            key: "0",
            path: "",
            component: import("./pages/application/list.vue"),
          },
          {
            title: "待提交",
            isNavigator: true,
            key: "0",
            path: "submit",
            component: import("./pages/application/list.vue"),
          },
          {
            title: "审核中",
            isNavigator: true,
            key: "1",
            path: "verify",
            component: import("./pages/application/list.vue"),
          },
          {
            title: "已退回",
            isNavigator: true,
            key: "2",
            path: "return",
            component: import("./pages/application/list.vue"),
          },
        ],
      },
      {
        path: "applicationApply/:type",
        component: import("./pages/application/apply.vue"),
      },
      {
        name: "directorManage",
        title: "负责人管理",
        path: "directorManage",
        isNavigator: true,
        component: import("./pages/directorManage/index.vue"),
      },
      {
        name: "directorManageInfo",
        path: "directorManageInfo",
        component: import("./pages/directorManage/info.vue"),
      },
      {
        path: ":path",
        redirect: "/home",
      },
    ],
  },
  {
    path: "/login",
    component: import("./pages/login/index.vue"),
  },
  {
    path: "",
    redirect: "/home",
  },
  {
    path: "/:path",
    redirect: "/home",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

function directorGuard(
  state: GuardState,
  permission: number[],
  next: NavigationGuardNext
): GuardState {
  if (
    !permission.includes(2) &&
    ["directorManage", "directorManageInfo", "dataHome"].includes(state.name)
  ) {
    state.next = true;
    state.nextFn = () =>
      next({
        path: "/home/applicationList",
      });
  }
  return state;
}

function adminGuard(state: GuardState, permission: number[]): GuardState {
  if (permission.includes(1)) state.next = true;
  return state;
}
interface GuardState {
  name: string;
  next: boolean;
  path?: string;
  nextFn: () => void;
}

router.beforeEach(async (to, from, next) => {
  const state: GuardState = {
    name: to.name as string,
    next: false,
    path: to.path,
    nextFn: next,
  };
  const permission = getPermission();
  if (adminGuard(state, permission).next) return state.nextFn();
  if (directorGuard(state, permission, next).next) return state.nextFn();
  next();
});

export { routes };

export default router;
