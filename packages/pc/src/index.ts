import { createApp } from "vue";
import App from "./app.vue";
import ElementPlus from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import router from "./router";
import { createPinia } from "pinia";
import "./styles/index.scss";
import "element-plus/dist/index.css";

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.use(ElementPlus, {
  locale: zhCn,
});
app.mount("#app");
