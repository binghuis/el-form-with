import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";

import { createMemoryHistory, createRouter } from "vue-router";
import routes from "./routes";
import { useElementPlus } from "./plugins/elementPlus";

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

const app = createApp(App);

app.use(router).use(useElementPlus).mount("#app");
