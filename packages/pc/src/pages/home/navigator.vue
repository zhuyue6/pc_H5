<template>
  <el-aside class="asideContainer">
    <el-menu :default-active="route.path" :router="true">
      <template v-for="item of menus">
        <template v-if="item.children && item.children.length > 0">
          <el-sub-menu :index="item.key" :key="item.key">
            <template #title>
              <el-icon v-if="item.icon">
                <component :is="item.icon" />
              </el-icon>
              <span>{{ item.title }}</span>
            </template>
            <el-menu-item
              :key="childItem.path"
              :index="childItem.path"
              v-for="childItem of item.children"
            >
              <el-icon v-if="childItem.icon">
                <component :is="childItem.icon" />
              </el-icon>
              <span>{{ childItem.title }}</span>
            </el-menu-item>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item :index="item.path" :key="item.path">
            <el-icon v-if="item.icon">
              <component :is="item.icon" />
            </el-icon>
            <span>{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </el-aside>
</template>

<script setup lang="ts">
import { ElMenuItem, ElSubMenu } from "element-plus";
import { type Component, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { routes, IRouter } from "@/router";
import { util } from "@/shared";

// let approverRole = ref(0);

interface Menu {
  title?: string;
  path?: string;
  key?: string;
  icon?: Component;
  active?: boolean;
  children?: Menu[];
}

const route = useRoute();

const menus = ref<Menu[]>([]);

function formatRoutes(routes: IRouter[], basePath = "", isRoot = false) {
  let list: Menu[] = [];
  for (const routeItem of routes ?? []) {
    if (isRoot && routeItem.name === "home") {
      list = formatRoutes(
        routeItem.children as IRouter[],
        basePath + routeItem.path
      );
      break;
    }
    if (!isRoot && routeItem.isNavigator) {
      const path =
        routeItem.path !== ""
          ? basePath + "/" + routeItem.path
          : basePath + routeItem.path;
      const menu: Menu = {
        title: routeItem.title,
        path,
        icon: routeItem.icon,
        children: formatRoutes(routeItem.children as IRouter[], path),
      };
      list.push(menu);
    }
  }
  return list;
}

const aaa = formatRoutes(routes, "", true);
menus.value = aaa;
console.log(aaa);
// // 第一期先根据身份渲染数据menu
// let applyMenu = ref<Menu[]>([]);
// let menus = ref<Menu[]>([]);
// const initMenu = () => {
//   if (Number(approverRole.value) == 0) {
//     applyMenu.value = [
//       {
//         title: "待提交",
//         key: "0",
//         path: "/application/list?status=10",
//       },
//       {
//         title: "审核中",
//         key: "1",
//         path: "/application/list?status=20",
//       },
//       {
//         title: "已退回",
//         key: "2",
//         path: "/application/list?status=40",
//       },
//     ];
//   } else if ([10, 20, 30, 40, 50, 60].includes(Number(approverRole.value))) {
//     applyMenu.value = [
//       {
//         title: "审核中",
//         key: "1",
//         path: "/application/list?status=20",
//       },
//       {
//         title: "已通过",
//         key: "1",
//         path: "/application/list?status=30",
//       },
//       {
//         title: "已退回",
//         key: "2",
//         path: "/application/list?status=40",
//       },
//     ];
//   }
//   // console.log('applyMenu===>', applyMenu);
//   menus.value = [
//     {
//       title: "数据首页",
//       path: "/home",
//       icon: DataLine,
//     },
//     {
//       title: "数据列表",
//       // path: "/application/list",
//       icon: Collection,
//       children: applyMenu,
//     },
//     {
//       title: "负责人管理",
//       path: "/home/directorManage",
//       icon: Collection,
//     }
//   ];
// };
// onMounted(() => {
//   const userinfo = util.getUserInfo();
//   approverRole.value = userinfo.approverRole;
//   initMenu();
// });
</script>

<style scoped>
.asideContainer {
  padding-top: 2px;
}
</style>
