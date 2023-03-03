import { defineConfig } from "vite";
import vuePlugin from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import mockDevServerPlugin from "vite-plugin-mock-dev-server";
import basicSsl from "@vitejs/plugin-basic-ssl";
import * as api from "./httpApi.config";
import url from "node:url";
import path from "node:path";

const isMock = process.argv.at(-1) === "mock";
const plugins = [
  vuePlugin(),
  basicSsl(),
  AutoImport({
    resolvers: [ElementPlusResolver()],
  }),
  Components({
    resolvers: [ElementPlusResolver()],
  }),
];
if (isMock) plugins.push(mockDevServerPlugin());

export default defineConfig({
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        javascriptEnabled: true,
      },
    },
  },
  build: {
    outDir: path.join(
      path.dirname(url.fileURLToPath(import.meta.url)),
      "../../dist/pc"
    ),
  },
  server: {
    host: true,
    port: 8080,
    https: true,
    cors: true,
    proxy: {
      [`^${api.proxyPath}`]: {
        changeOrigin: true,
        target: `https://${api.host}`,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  plugins,
});
