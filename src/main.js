import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "mosha-vue-toastify/dist/style.css";
// import "mdb-vue-ui-kit/css/mdb.min.css";
import "./assets/app.scss";

createApp(App)
  .use(router)
  .mount("#app");
