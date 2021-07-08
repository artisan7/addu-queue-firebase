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
                    <router-link to="/issue" class="nav-link"
                        >Issue Num</router-link
                    >
                </MDBNavbarItem>
                <template v-for="(station, key) in stations" :key="station">
                    <MDBNavbarItem to="#">
                        <router-link
                            :to="`/station/${station}`"
                            class="nav-link"
                        >
                            {{ key }} Controls</router-link
                        >
                    </MDBNavbarItem>
                    <MDBNavbarItem to="#">
                        <router-link
                            :to="`/display/${station}`"
                            class="nav-link"
                            >Display {{ key }}</router-link
                        >
                    </MDBNavbarItem>
                </template>
                <MDBNavbarItem>{{isLogin}}</MDBNavbarItem>
            </MDBNavbarNav>
        </MDBCollapse>
    </MDBNavbar>
    <router-view />
</template>

<script>
import {
    MDBNavbar,
    MDBNavbarToggler,
    MDBNavbarBrand,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBCollapse,
} from "mdb-vue-ui-kit";
import { ref } from "vue";
import {useAuth} from "./firebase"

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
    },
    setup() {
        const collapse1 = ref(false);
        const dropdown1 = ref(false);

        const { isLogin } = useAuth();

        return {
            collapse1,
            dropdown1,
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
