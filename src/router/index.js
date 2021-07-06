import { createRouter, createWebHistory } from "vue-router";
import Registration from "../views/Registration.vue";
import Station from "../views/Station.vue";

const routes = [
  {
    path: "/issue",
    name: "Issue",
    component: Registration,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/station/:station",
    name: "Station Control",
    component: Station,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
