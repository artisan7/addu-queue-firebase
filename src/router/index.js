import { createRouter, createWebHistory } from "vue-router";
import { userUids } from "../secrets";
import { useAuthServer } from "../firebase";
import Issue from "../views/Issue.vue";
import Home from "../views/Home.vue";
import Station from "../views/Station.vue";
import Display from "../views/Display.vue";
import SignIn from "../views/SignIn.vue";
import SignOut from "../views/SignOut.vue";
import Admin from "../views/Admin.vue";

const { isLogin, user } = useAuthServer();

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

router.beforeEach((to, from, next) => {
  if (to.meta.authRequired) {
    if (isLogin.value)
      if( to.path === "/admin" ){
        if( userUids.admin.includes( user.value.uid ) )
          next();
        else {
          alert("You do not have the authorization to use this page!");
          next({
            name: "Home",
          });
        }
      }
      else if (to.meta.stationRequired) {
        if (
          userUids[to.params.station].includes(user.value.uid) ||
          userUids.admin.includes(user.value.uid)
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

// import { useAuthServer } from "../firebase";
// const { isLogin, user } = useAuthServer();

// const userPermissions = {
//   // admin: ["dRojiWD0xyev6lV89h4w8CYKprQ2"],
//   admin: [],
//   issue: ["dRojiWD0xyev6lV89h4w8CYKprQ2"],
//   registration: [],
//   consultation: [],
//   screening: [],
//   vaccination: [],
// };

// router.beforeEach((to, from, next) => {
//   if (user.value !== null)
//     console.log(
//       user,
//       user.value.uid,
//       userPermissions.admin.includes(user.value.uid)
//     );

//   // Reroute to sign in form if not authenticated
//   if (to.name !== "Sign In" && !isLogin.value) next({ name: "Sign In" });
//   else {
//     // check if user is valid
//     if (user.value !== null) {
//       // Everyone can go to home
//       if (to.name === "Home") next();
//       // Admins can access everything
//       else if (userPermissions.admin.includes(user.value.uid)) {
//         console.log(to);
//         next();
//       }
//       // Issue Queues
//       else if (userPermissions.issue.includes(user.value.uid)) {
//         console.log("Checking issue");
//         if (to.name === "Issue") next();
//         else
//           next({
//             name: "Home",
//             props: {
//               error: "You are not authorized to access this page.",
//             },
//           });
//       }
//       // Registration
//       else if (userPermissions.registration.includes(user.value.uid)) {
//         console.log("Checking registration");
//         console.log(to.params);
//         if (to.params.station === "registration") next();
//         else
//           next({
//             name: "Home",
//             props: {
//               error: "You are not authorized to access this page.",
//             },
//           });
//       }

//       // Consultation
//       else if (userPermissions.consultation.includes(user.value.uid)) {
//         console.log("Checking consultation");
//         if (to.params.station === "consultation") next();
//         else
//           next({
//             name: "Home",
//             props: {
//               error: "You are not authorized to access this page.",
//             },
//           });
//       }

//       // Screening
//       else if (userPermissions.screening.includes(user.value.uid)) {
//         console.log("Checking screening");
//         if (to.params.station === "screening") next();
//         else
//           next({
//             name: "Home",
//             props: {
//               error: "You are not authorized to access this page.",
//             },
//           });
//       }

//       // Vaccination
//       else if (userPermissions.vaccination.includes(user.value.uid)) {
//         console.log("Checking vaccination");
//         if (to.params.station === "vaccination") next();
//         else
//           next({
//             name: "Home",
//             props: {
//               error: "You are not authorized to access this page.",
//             },
//           });
//       }

//       // Can only visit homepage if not permissions
//       else next("/");
//     } else next();
//   }
// });

export default router;
