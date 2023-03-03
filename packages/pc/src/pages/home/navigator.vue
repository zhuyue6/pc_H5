<template>
  <el-aside class="asideContainer">
    <el-menu :default-active="route.path" :router="true">
      <template v-for="item of menus">
        <template v-if="item.children && item.children.length > 0">
          <el-sub-menu :index="item.path" :key="item.key">
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
import { type Component, ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { routes, IRouter } from "@/router";
import { util } from "@/shared";

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

watch(routes, () => {
  menus.value = formatRoutes(routes.value, "", true);
});

menus.value = formatRoutes(routes.value, "", true);
</script>

<style scoped>
.asideContainer {
  padding-top: 2px;
}
</style>
