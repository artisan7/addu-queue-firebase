import { createRouter, createWebHistory } from "vue-router";
// import { userUids } from "../secrets";
// import { useAuthServer } from "../firebase";
import Issue from "../views/Issue.vue";
import Home from "../views/Home.vue";
import Station from "../views/Station.vue";
import Display from "../views/Display.vue";
import SignIn from "../views/SignIn.vue";
import SignOut from "../views/SignOut.vue";
import Admin from "../views/Admin.vue";

// const { isLogin, user } = useAuthServer();

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    props: {
      error: false,
    },
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
    path: "/issue",
    name: "Issue",
    component: Issue,
    meta: {
      authRequired: true,
    },
  },
  {
    path: "/station/:station",
    name: "Station Control",
    component: Station,
    meta: {
      authRequired: true,
      stationRequired: true,
    },
  },
  {
    path: "/display/:station",
    name: "Station Display",
    component: Display,
  },
  {
    path: "/signin",
    name: "Sign In",
    component: SignIn,
  },
  {
    path: "/signout",
    name: "Sign Out",
    component: SignOut,
    meta: {
      authRequired: true,
    },
  },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
    meta: {
      authRequired: true,
    },
  },
];
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// router.beforeEach((to, from, next) => {
//   if (to.meta.authRequired) {
//     if (isLogin.value)
//       if( to.path === "/admin" ){
//         if( userUids.admin.includes( user.value.uid ) )
//           next();
//         else {
//           alert("You do not have the authorization to use this page!");
//           next({
//             name: "Home",
//           });
//         }
//       }
//       else if (to.meta.stationRequired) {
//         if (
//           userUids[to.params.station].includes(user.value.uid) ||
//           userUids.admin.includes(user.value.uid)
//         )
//           next();
//         else {
//           alert("You do not have the authorization to use this page!");
//           next({
//             name: "Home",
//           });
//         }
//       } else next();
//     else {
//       alert("You must be signed in to see this page!");
//       next({
//         name: "Sign In",
//       });
//     }
//   } else next();
// });

export default router;
