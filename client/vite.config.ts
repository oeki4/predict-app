import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as fs from "node:fs";
import * as path from "node:path";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      "@shared": path.resolve(__dirname, "./src/shared"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@widgets": path.resolve(__dirname, "./src/widgets"),
      "@entities": path.resolve(__dirname, "./src/entities"),
      "@app": path.resolve(__dirname, "./src/app"),
      "@public": path.resolve(__dirname, "./public"),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@shared/styles/scss/core.scss" as *;
        `,
      },
    },
  },
  server: {
    port: 80,
    // port: 443,
    host: "0.0.0.0",
    allowedHosts: true,
    // hmr: {
    //   host: "tycorn.local",
    //   port: 443,
    // },
    // https: {
    //   key: fs.readFileSync("../.cert/tycorn-key.pem"),
    //   cert: fs.readFileSync("../.cert/tycorn.pem"),
    // },
  },
});
