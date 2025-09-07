import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import { type ManifestOptions, VitePWA } from "vite-plugin-pwa";
import manifest from "./manifest.json";

import { execSync } from "child_process";

const commitHash = execSync("git rev-parse --short HEAD").toString().trim();

// https://vite.dev/config/
export default defineConfig({
  define: {
    GIT_HASH: JSON.stringify(commitHash),
  },
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: manifest as unknown as ManifestOptions,
    }),
  ],
  base: "/gin-rummy-scoreboard/",
});
