<template>
  <MDBContainer>
    <MDBRow tag="form" class="g-3">
      <MDBInput
        inputGroup
        :formOutline="false"
        v-model="form.email"
        aria-describedby="basic-addon1"
        aria-label="Username"
        placeholder="Username"
      >
      </MDBInput>
      <MDBInput
        inputGroup
        :formOutline="false"
        v-model="form.password"
        type="password"
        aria-describedby="basic-addon2"
        aria-label="Password"
        placeholder="Password"
      >
      </MDBInput>
      <MDBBtn color="primary" class="mt-3" @click="signIn">
        Login
      </MDBBtn>
    </MDBRow>
  </MDBContainer>
</template>

<script>
import { MDBContainer, MDBInput, MDBRow, MDBBtn } from "mdb-vue-ui-kit";
import { ref } from "@vue/reactivity";
import { useAuth } from "../firebase";

export default {
  components: { MDBContainer, MDBInput, MDBRow, MDBBtn },
  setup() {
    const { signInWithForm } = useAuth();

    const form = ref({
      email: "",
      password: "",
    });

    const signIn = () => {
      signInWithForm(form.value.email, form.value.password)
        .then((success) => {
          console.log(success);
        })
        .catch((err) => console.log(err));
    };

    return {
      form,
      signIn,
    };
  },
};
</script>

<style></style>
