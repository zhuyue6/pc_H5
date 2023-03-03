import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
  type NavigationGuardNext,
} from "vue-router";
import { type Component, ref } from "vue";
import { simpleDeepCopy } from "@/shared/util";
import { getPermission } from "@/services/permission";
interface RouteMenu {
  title?: string;
  icon?: Component;
  key?: string | number;
  isNavigator?: boolean;
  children?: IRouter[];
}

export type IRouter = RouteRecordRaw & RouteMenu;

const routesInit = [
  {
    path: "/home",
    name: "home",
    component: () => import("./pages/home/index.vue"),
    children: [
      {
        path: "",
        title: "数据首页",
        name: "dataHome",
        isNavigator: true,
        component: () => import("./pages/dataHome/index.vue"),
      },
      {
        name: "directorManage",
        title: "人员管理",
        path: "directorManage",
        isNavigator: true,
        component: () => import("./pages/directorManage/index.vue"),
      },
      {
        name: "directorManageInfo",
        path: "directorManageInfo",
        component: () => import("./pages/directorManage/info.vue"),
      },
      {
        path: ":path",
        redirect: "/home",
      },
    ],
  },
  {
    path: "/login",
    component: () => import("./pages/login/index.vue"),
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

const routes = ref<IRouter[]>(routesInit);

const router = createRouter({
  history: createWebHistory(),
  routes: routes.value,
});

function directorGuard(state: GuardState, permission: number[]): GuardState {
  if (permission.includes(2)) {
    state.addRouters = pushRouters(
      [
        { name: "directorManageInfo" },
        { name: "directorManage" },
        { name: "dataHome" },
      ],
      state.addRouters
    );
  } else {
    state.deleteRouters = pushRouters(
      [
        { name: "directorManageInfo" },
        { name: "directorManage" },
        { name: "dataHome" },
      ],
      state.deleteRouters
    );
  }
  return state;
}

function adminGuard(state: GuardState, permission: number[]): GuardState {
  if (permission.includes(1)) {
    state.addRouters = pushRouters(
      [{ name: "directorManageInfo" }, { name: "directorManage" }],
      state.addRouters
    );
  } else {
    state.deleteRouters = pushRouters(
      [{ name: "directorManageInfo" }, { name: "directorManage" }],
      state.deleteRouters
    );
  }
  return state;
}
interface GuardState {
  name: string;
  next: boolean;
  path?: string;
  addRouters: any[];
  deleteRouters: any[];
}

router.beforeEach(async (to, from, next) => {
  const state: GuardState = {
    name: to.name as string,
    next: false,
    path: to.path,
    addRouters: [],
    deleteRouters: [],
  };
  const permission = getPermission();
  adminGuard(state, permission);
  directorGuard(state, permission);
  guardNext(state, next);
});

function guardNext(state: GuardState, next: NavigationGuardNext) {
  const deleteList = state.deleteRouters.filter((deleteRouter) => {
    return (
      -1 ===
      state.addRouters.findIndex((addRouter) => {
        let filter = false;
        if (
          (deleteRouter.name && deleteRouter.name === addRouter.name) ||
          (deleteRouter.path && deleteRouter.path === addRouter.path)
        ) {
          filter = true;
        }
        return filter;
      })
    );
  });
  deletesRoutes(deleteList);
  if (deleteList.length > 0) {
    if (
      deleteList.find((item) => {
        let filter = false;
        if (
          (item.name && item.name === state.name) ||
          (item.path && item.path === state.path)
        ) {
          filter = true;
        }
        return filter;
      })
    ) {
      return next({
        path: "/home/applicationList/verify",
      });
    }
  }
  next();
}

function pushRouters(
  oRouters: Partial<IRouter>[],
  iRouters: Partial<IRouter>[]
) {
  const list = [];
  for (const oRouter of oRouters) {
    const has = iRouters.find((iRouter) => {
      let filter = false;
      if (
        (oRouter.name && oRouter.name === iRouter.name) ||
        (oRouter.path && oRouter.path === iRouter.path)
      ) {
        filter = true;
      }
      return filter;
    });
    if (!has) {
      list.push(oRouter);
    }
  }
  return list.concat(iRouters);
}

function deletesRoutes(dRouters: Partial<RouteRecordRaw>[]) {
  let newRoutes = simpleDeepCopy(routesInit);
  for (const dRouter of dRouters) {
    newRoutes = deleteRoute(dRouter, newRoutes);
  }
  routes.value = newRoutes;
}

function deleteRoute(dRouter: Partial<RouteRecordRaw>, iRouters: IRouter[]) {
  const routers: IRouter[] = iRouters;
  const newRoutes = routers.filter((router) => {
    if ((router.children?.length ?? []) > 0) {
      router.children = deleteRoute(dRouter, router.children as IRouter[]);
    }
    let filter = true;
    if (
      (dRouter.name && dRouter.name === router.name) ||
      (dRouter.path && dRouter.path === router.path)
    ) {
      filter = false;
    }
    return filter;
  });
  return newRoutes;
}

export { routes };

export default router;
