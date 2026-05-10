import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// `base` is set so the site loads correctly from
// https://<user>.github.io/nationid_example/. If you fork and rename, change it.
export default defineConfig({
  base: "/nationid_example/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2022",
    sourcemap: false,
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        // Group third-party deps so the app bundle isn't dominated by libs.
        // `nationid` is split out because catalog + extract + pii pull in the
        // full registry (~50 specs); keeping it in its own chunk lets the
        // browser cache it across deploys when only app code changes.
        manualChunks(id) {
          if (id.includes("/node_modules/nationid/")) return "nationid";
          if (id.includes("/node_modules/react") || id.includes("/node_modules/scheduler")) {
            return "react";
          }
          if (id.includes("/node_modules/@radix-ui/")) return "radix";
          return undefined;
        },
      },
    },
  },
});
