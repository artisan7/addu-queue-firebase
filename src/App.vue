<template>
  <div class="d-flex flex-column" style="min-height: 100vh">
    <MDBNavbar id="main-nav" container expand="lg" dark bg="primary">
      <div class="d-flex">
        <MDBNavbarBrand href="#">
          <router-link to="/"
            ><img src="../public/addu-seal.png" height="100" />
          </router-link>
        </MDBNavbarBrand>
        <MDBNavbarBrand href="#">
          <router-link to="/">
            <img src="../public/nav_logo.png" height="80" />
          </router-link>
        </MDBNavbarBrand>
      </div>

      <MDBNavbarToggler
        @click="collapse1 = !collapse1"
        target="#navbarSupportedContent"
      ></MDBNavbarToggler>
      <MDBCollapse v-model="collapse1" id="navbarSupportedContent">
        <MDBNavbarNav class="mb-2 mb-lg-0">
          <MDBNavbarItem to="#">
            <router-link to="/issue" class="nav-link">Issue Num</router-link>
          </MDBNavbarItem>
          <MDBNavbarItem to="#">
            <router-link to="/station/registration" class="nav-link"
              >Registration Controls</router-link
            >
          </MDBNavbarItem>
          <MDBNavbarItem to="#">
            <router-link to="/display/registration" class="nav-link"
              >Display Registration</router-link
            >
          </MDBNavbarItem>
          <MDBNavbarItem>
            <MDBDropdown class="nav-item" v-model="adminDropdown">
              <MDBDropdownToggle
                tag="a"
                class="nav-link mt-2"
                @click="adminDropdown = !adminDropdown"
                >Monitoring</MDBDropdownToggle
              >
              <MDBDropdownMenu aria-labelledby="dropdownMenuButton">
                <li href="#">
                  <router-link to="/monitoring/overview" class="dropdown-item"
                    >Queue List Overview</router-link
                  >
                </li>
                <li v-for="(station, key) in stations" :key="station" href="#">
                  <router-link
                    :to="`/monitoring/${station}`"
                    class="dropdown-item"
                    >{{ key }}</router-link
                  >
                </li>
              </MDBDropdownMenu>
            </MDBDropdown>
          </MDBNavbarItem>

          <MDBNavbarItem>
            <MDBDropdown class="nav-item" v-model="displayDropdown">
              <MDBDropdownToggle
                tag="a"
                class="nav-link mt-2"
                @click="displayDropdown = !displayDropdown"
                >Admin</MDBDropdownToggle
              >
              <MDBDropdownMenu aria-labelledby="dropdownMenuButton">
                <li href="#">
                  <router-link to="/admin" class="dropdown-item"
                    >Admin Controls</router-link
                  >
                </li>
                <li href="#">
                  <router-link to="/dashboard" class="dropdown-item"
                    >Admin Dashboard</router-link
                  >
                </li>
              </MDBDropdownMenu>
            </MDBDropdown>
          </MDBNavbarItem>
          <MDBNavbarItem v-if="!isLogin" to="#">
            <router-link :to="`/signin`" class="nav-link">Sign In</router-link>
          </MDBNavbarItem>
          <MDBNavbarItem v-else to="#">
            <router-link :to="`/signout`" class="nav-link"
              >Sign Out</router-link
            >
          </MDBNavbarItem>
        </MDBNavbarNav>
      </MDBCollapse>
    </MDBNavbar>

    <div class="flex-grow-1">
      <router-view v-bind="$attrs" />
    </div>

    <div
      class="d-flex flex-column align-items-center justify-content-center mt-4"
    >
      <h5 style="transform: translateY(25px)">Powered by</h5>
      <img src="/horizontal-logo.png" height="100" />
    </div>
  </div>
</template>

<script>
import {
  MDBNavbar,
  MDBNavbarToggler,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBCollapse,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBDropdown,
} from "mdb-vue-ui-kit";
import { ref } from "vue";
import { useAuth } from "./firebase";

export default {
  data: () => ({
    stations: {
      // Registration: "registration",
      Vitals: "vitals",
      Counseling: "counseling",
      Screening: "screening",
      Vaccination: "vaccination",
      "Post Vaccination": "post",
    },
  }),
  components: {
    MDBNavbar,
    MDBNavbarToggler,
    MDBNavbarBrand,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBCollapse,
    MDBDropdownMenu,
    MDBDropdownToggle,
    MDBDropdown,
  },
  setup() {
    const { isLogin } = useAuth();

    const collapse1 = ref(false);
    const adminDropdown = ref(false);
    const displayDropdown = ref(false);

    return {
      collapse1,
      adminDropdown,
      displayDropdown,
      isLogin,
    };
  },
};
</script>

<style>
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif; */
  font-family: Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#main-nav {
  background-color: #2f84bd !important;
  margin-bottom: 10px;
}
</style>
