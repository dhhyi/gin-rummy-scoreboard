import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import { type ManifestOptions, VitePWA } from "vite-plugin-pwa";
import manifest from "./manifest.json";

// https://vite.dev/config/
export default defineConfig({
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
