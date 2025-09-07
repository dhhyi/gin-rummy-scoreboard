import { registerSW } from "virtual:pwa-register";
import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";

createApp(App).mount("#app");

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
