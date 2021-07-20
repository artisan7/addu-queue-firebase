import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "mdb-vue-ui-kit/css/mdb.min.css";
import "mosha-vue-toastify/dist/style.css";
// import "./assets/app.scss";

createApp(App)
  .use(router)
  .mount("#app");
