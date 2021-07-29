import { createRouter, createWebHistory } from "vue-router";
import { useAuthServer } from "../firebase";
import { adminUids } from "../secrets";

import Issue from "../views/Issue.vue";
import Station from "../views/Station.vue";
import Display from "../views/Display.vue";
import SignIn from "../views/SignIn.vue";
import SignOut from "../views/SignOut.vue";
import Admin from "../views/Admin.vue";
import Monitoring from "../views/Monitoring.vue";
import Dashboard from "../views/Dashboard.vue";
import QueueOverview from "../views/QueueOverview.vue";

const { isLogin, user, permissions } = useAuthServer();

const routes = [
  {
    path: "/",
    name: "Home",
    component: Dashboard,
    props: {
      authRequired: true,
      adminRequired: true,
    },
  },
  {
    path: "/issue",
    name: "Issue",
    component: Issue,
    meta: {
      authRequired: true,
      issueRequired: true,
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
    path: "/monitoring/overview",
    name: "Queue List Overview",
    component: QueueOverview,
    meta: {
      authRequired: true,
      stationRequired: true,
    },
  },
  {
    path: "/monitoring/:station",
    name: "Monitoring",
    component: Monitoring,
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
      adminRequired: true,
    },
  },
  // {
  //   path: "/dashboard",
  //   name: "Dashboard",
  //   component: Dashboard,
  //   meta: {
  //     authRequired: true,
  //     adminRequired: true,
  //   },
  // },
];
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// router.beforeEach((to, from, next) => {
//   console.log("Hello world", userPermissions);
//   next();
// });

router.beforeEach((to, from, next) => {
  permissions().then((userPermissions) => {
    if (to.meta.authRequired) {
      if (isLogin.value)
        if (to.meta.adminRequired) {
          if (adminUids.includes(user.value.uid)) next();
          else {
            alert("You do not have the authorization to use this page!");
            next({
              name: "Home",
            });
          }
        } else if (to.meta.stationRequired) {
          if (
            adminUids.includes(user.value.uid) ||
            ((to.name === "Monitoring" || to.name === "Queue List Overview") &&
              userPermissions.monitoring.includes(user.value.uid)) ||
            userPermissions[to.params.station].includes(user.value.uid)
          )
            next();
          else {
            alert("You do not have the authorization to use this page!");
            next({
              name: "Home",
            });
          }
        } else if (to.meta.issueRequired) {
          if (
            adminUids.includes(user.value.uid) ||
            userPermissions.issue.includes(user.value.uid)
          )
            next();
          else {
            alert("You do not have the authorization to use this page!");
            next({
              name: "Home",
            });
          }
        } else next();
      else {
        alert("You must be signed in to see this page!");
        next({
          name: "Sign In",
        });
      }
    } else next();
  });
});

export default router;
