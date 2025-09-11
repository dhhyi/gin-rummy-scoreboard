import { registerSW } from "virtual:pwa-register";
import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import App from "./App.vue";
import en from "./locales/en.json";
import "./style.css";

const i18n = createI18n({
  legacy: false,
  locale: navigator.language,
  fallbackLocale: ["en", "de"],
  messages: {
    en,
  },
});

createApp(App).use(i18n).mount("#app");

const intervalMS = 60 * 1000;

registerSW({
  onRegistered(r) {
    if (r) {
      setInterval(() => {
        r.update();
      }, intervalMS);
    }
  },
});
