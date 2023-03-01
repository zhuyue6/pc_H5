import { createApp } from "vue";
import App from "./app.vue";
import router from "./router";
import { createPinia } from "pinia";
import "./styles/index.scss";
import "vant/lib/index.css";
import "vant/es/toast/style";
import "vant/es/dialog/style";
import "vant/es/notify/style";
import "vant/es/image-preview/style";

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.mount("#app");
