<template>
  <MDBContainer class="d-flex align-items-center mt-5 flex-column">
    <MDBSpinner color="primary" />
    <div class="lead">Signing Out...</div>
  </MDBContainer>
</template>

<script>
import { MDBContainer, MDBSpinner } from "mdb-vue-ui-kit";
import { useAuth } from "./../firebase";
export default {
  components: { MDBContainer, MDBSpinner },
  mounted() {
    const { signOut, isLogin } = useAuth();
    if (isLogin) signOut();

    this.$router.push("/signin");
  },
};
</script>

<style></style>
