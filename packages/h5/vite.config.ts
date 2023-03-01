import { defineConfig } from "vite";
import vuePlugin from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "unplugin-vue-components/resolvers";
import mockDevServerPlugin from "vite-plugin-mock-dev-server";
import basicSsl from "@vitejs/plugin-basic-ssl";

const plugins = [
  vuePlugin(),
  AutoImport({
    resolvers: [VantResolver()],
  }),
  Components({
    resolvers: [VantResolver()],
  }),
  basicSsl(),
];

const isMock = process.argv.at(-1) === "mock";
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
    emptyOutDir: true,
  },
  server: {
    port: 8080,
  },
  plugins,
});
