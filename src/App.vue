<template>
  <MDBNavbar id="main-nav" container expand="lg" dark bg="primary">
    <MDBNavbarBrand href="#"
      ><img src="../public/nav_logo.png" width="100" />
    </MDBNavbarBrand>
    <MDBNavbarToggler
      @click="collapse1 = !collapse1"
      target="#navbarSupportedContent"
    ></MDBNavbarToggler>
    <MDBCollapse v-model="collapse1" id="navbarSupportedContent">
      <MDBNavbarNav class="mb-2 mb-lg-0">
        <MDBNavbarItem to="#">
          <router-link to="/issue" class="nav-link">Issue Num</router-link>
        </MDBNavbarItem>
        <MDBNavbarItem>
          <MDBDropdown class="nav-item" v-model="stationDropdown">
            <MDBDropdownToggle
              tag="a"
              class="nav-link mt-2"
              @click="stationDropdown = !stationDropdown"
              >Station</MDBDropdownToggle
            >
            <MDBDropdownMenu aria-labelledby="dropdownMenuButton">
              <MDBDropdownItem
                v-for="(station, key) in stations"
                :key="station"
                :href="`/station/${station}`"
              >
                {{ key }}
              </MDBDropdownItem>
            </MDBDropdownMenu>
          </MDBDropdown>
        </MDBNavbarItem>
        <MDBNavbarItem>
          <MDBDropdown class="nav-item" v-model="displayDropdown">
            <MDBDropdownToggle
              tag="a"
              class="nav-link mt-2"
              @click="displayDropdown = !displayDropdown"
              >Display</MDBDropdownToggle
            >
            <MDBDropdownMenu aria-labelledby="dropdownMenuButton">
              <MDBDropdownItem
                v-for="(station, key) in stations"
                :key="station"
                :href="`/display/${station}`"
              >
                {{ key }}
              </MDBDropdownItem>
            </MDBDropdownMenu>
          </MDBDropdown>
        </MDBNavbarItem>

        <!-- <template v-for="(station, key) in stations" :key="station">
          <MDBNavbarItem to="#">
            <router-link :to="`/station/${station}`" class="nav-link">
              {{ key }} Controls</router-link
            >
          </MDBNavbarItem>
          <MDBNavbarItem to="#">
            <router-link :to="`/display/${station}`" class="nav-link"
              >Display {{ key }}</router-link
            >
          </MDBNavbarItem>
        </template> -->
        <MDBNavbarItem v-if="!isLogin" to="#">
          <router-link :to="`/signin`" class="nav-link">Sign In</router-link>
        </MDBNavbarItem>
        <MDBNavbarItem v-else to="#">
          <router-link :to="`/signout`" class="nav-link">Sign Out</router-link>
        </MDBNavbarItem>
      </MDBNavbarNav>
    </MDBCollapse>
  </MDBNavbar>
  <router-view v-bind="$attrs" @error="errorMessage" />
  <div
    class="alert alert-danger m-5 fixed-top"
    :class="{
      active: error,
    }"
    role="alert"
  >
    {{ errorString }}
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
  MDBDropdownItem,
  MDBDropdownToggle,
  MDBDropdown,
} from "mdb-vue-ui-kit";
import { ref } from "vue";
import { useAuth } from "./firebase";

export default {
  data: () => ({
    stations: {
      Registration: "registration",
      Screening: "screening",
      Vitals: "vitals",
      Vaccination: "vaccination",
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
    MDBDropdownItem,
    MDBDropdownToggle,
    MDBDropdown,
  },
  setup() {
    const { isLogin } = useAuth();

    const collapse1 = ref(false);
    const stationDropdown = ref(false);
    const displayDropdown = ref(false);
    const error = ref(false);
    const errorString = ref("");

    function errorMessage(message) {
      error.value = true;
      setTimeout(() => {
        error.value = false;
      }, 2000);
      errorString.value = message;
    }
    return {
      collapse1,
      stationDropdown,
      displayDropdown,
      isLogin,
      error,
      errorString,
      errorMessage,
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

.alert {
  transition: all 500ms ease;
  opacity: 0;
  overflow: none;
  transform: translateY(-200%);
}

.alert.active {
  opacity: 1;
  transform: translateY(0);
}
</style>
