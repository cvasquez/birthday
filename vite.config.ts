import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths()],
  server: {
    port: 3000,
    open: true,
  },
  define: {
    // Vite doesn't include process.env by default
    "process.env": process.env,
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
});
